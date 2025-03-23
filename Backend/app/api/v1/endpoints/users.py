from typing import Any, List
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app import crud
from app.api import deps
from app.schemas.reservation import Reservation, ReservationCreate, ReservationUpdate
from app.models.user import User, UserRole
from app.models.reservation import ReservationStatus

router = APIRouter()

@router.get("/", response_model=List[Reservation])
def read_reservations(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Retrieve reservations.
    """
    if current_user.role in [UserRole.ADMIN, UserRole.STAFF]:
        # Les administrateurs et le personnel peuvent voir toutes les réservations
        reservations = crud.reservation.get_multi(db, skip=skip, limit=limit)
    else:
        # Les clients ne peuvent voir que leurs propres réservations
        reservations = crud.reservation.get_by_user(db, user_id=current_user.id, skip=skip, limit=limit)
    return reservations

@router.post("/", response_model=Reservation)
def create_reservation(
    *,
    db: Session = Depends(deps.get_db),
    reservation_in: ReservationCreate,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Create new reservation.
    """
    # Vérifier si la date est future
    if reservation_in.date < datetime.now():
        raise HTTPException(
            status_code=400,
            detail="La date de réservation doit être dans le futur.",
        )
    
    reservation = crud.reservation.create_with_user(
        db=db, obj_in=reservation_in, user_id=current_user.id
    )
    return reservation

@router.get("/{reservation_id}", response_model=Reservation)
def read_reservation(
    *,
    db: Session = Depends(deps.get_db),
    reservation_id: int,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get reservation by ID.
    """
    reservation = crud.reservation.get(db=db, id=reservation_id)
    if not reservation:
        raise HTTPException(status_code=404, detail="Réservation non trouvée")
    
    # Vérifier si l'utilisateur a le droit de voir cette réservation
    if current_user.role not in [UserRole.ADMIN, UserRole.STAFF] and reservation.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Accès non autorisé")
    
    return reservation

@router.put("/{reservation_id}", response_model=Reservation)
def update_reservation(
    *,
    db: Session = Depends(deps.get_db),
    reservation_id: int,
    reservation_in: ReservationUpdate,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Update a reservation.
    """
    reservation = crud.reservation.get(db=db, id=reservation_id)
    if not reservation:
        raise HTTPException(status_code=404, detail="Réservation non trouvée")
    
    # Vérifier si l'utilisateur a le droit de modifier cette réservation
    if current_user.role not in [UserRole.ADMIN, UserRole.STAFF] and reservation.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Accès non autorisé")
    
    # Si la réservation est déjà annulée ou terminée, on ne peut plus la modifier
    if reservation.status in [ReservationStatus.CANCELLED, ReservationStatus.COMPLETED]:
        raise HTTPException(
            status_code=400,
            detail=f"La réservation avec le statut {reservation.status} ne peut pas être modifiée."
        )
    
    # Vérifier si la date est future
    if reservation_in.date and reservation_in.date < datetime.now():
        raise HTTPException(
            status_code=400,
            detail="La date de réservation doit être dans le futur.",
        )
    
    # Seul le personnel et les administrateurs peuvent modifier le statut
    if reservation_in.status is not None and current_user.role not in [UserRole.ADMIN, UserRole.STAFF]:
        raise HTTPException(
            status_code=403,
            detail="Seul le personnel peut modifier le statut d'une réservation"
        )
        
    reservation = crud.reservation.update(
        db=db, db_obj=reservation, obj_in=reservation_in
    )
    return reservation

@router.delete("/{reservation_id}", response_model=Reservation)
def cancel_reservation(
    *,
    db: Session = Depends(deps.get_db),
    reservation_id: int,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Cancel a reservation.
    """
    reservation = crud.reservation.get(db=db, id=reservation_id)
    if not reservation:
        raise HTTPException(status_code=404, detail="Réservation non trouvée")
    
    # Vérifier si l'utilisateur a le droit d'annuler cette réservation
    if current_user.role not in [UserRole.ADMIN, UserRole.STAFF] and reservation.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Accès non autorisé")
    
    # Si la réservation est déjà annulée ou terminée, on ne peut plus l'annuler
    if reservation.status in [ReservationStatus.CANCELLED, ReservationStatus.COMPLETED]:
        raise HTTPException(
            status_code=400,
            detail=f"La réservation avec le statut {reservation.status} ne peut pas être annulée."
        )
    
    reservation = crud.reservation.update_status(
        db=db, reservation_id=reservation_id, status=ReservationStatus.CANCELLED
    )
    return reservation

from sqlalchemy import create_engine, Column, Integer, String, Text, DECIMAL, Enum, TIMESTAMP, ForeignKey, func,Date
from sqlalchemy.orm import relationship
from app.database import Base 


class User(Base):
    __tablename__ = 'user'
    
    user_id = Column(Integer, primary_key=True, autoincrement=True)
    full_name = Column(String(100), nullable=False)
    email = Column(String(100), nullable=False, unique=True)
    phone = Column(String(15), nullable=False, unique=True) 
    role = Column(Enum('admin', 'customer', 'delivery_personnel'), nullable=False)

    compte_securities = relationship(
        "Password", back_populates="user_account", uselist=False, cascade="all, delete-orphan"
    )
    
    # Relationships
    customer = relationship("Customer", back_populates="user", uselist=False, cascade="all, delete-orphan")
    admin = relationship("Admin", back_populates="user", uselist=False, cascade="all, delete-orphan")
    delivery_personnel = relationship("DeliveryPersonnel", back_populates="user", uselist=False, cascade="all, delete-orphan")
    deliveries = relationship("Delivery", back_populates="delivery_personnel")

class Customer(Base):
    __tablename__ = 'customer'
    
    customer_id = Column(Integer, ForeignKey('user.user_id', ondelete='CASCADE'), primary_key=True)
    address = Column(String(255), nullable=False)
    
    # Relationships
    user = relationship("User", back_populates="customer")
    orders = relationship("Order", back_populates="customer")
    reservations = relationship("TableReservation", back_populates="customer")

class Admin(Base):
    __tablename__ = 'admin'
    
    admin_id = Column(Integer, ForeignKey('user.user_id', ondelete='CASCADE'), primary_key=True)
    
    # Relationships
    user = relationship("User", back_populates="admin")

class DeliveryPersonnel(Base):
    __tablename__ = 'deliverypersonnel'
    
    delivery_id = Column(Integer, ForeignKey('user.user_id', ondelete='CASCADE'), primary_key=True)
    vehicle_details = Column(String(255))
    
    # Relationships
    user = relationship("User", back_populates="delivery_personnel")

class Menu(Base):
    __tablename__ = 'menu'
    
    menu_id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    description = Column(Text)
    
    # Relationships
    menu_items = relationship("MenuItem", back_populates="menu")

class MenuItem(Base):
    __tablename__ = 'menuitem'
    
    item_id = Column(Integer, primary_key=True, autoincrement=True)
    menu_id = Column(Integer, ForeignKey('menu.menu_id', ondelete='CASCADE'))
    name = Column(String(100), nullable=False)
    description = Column(Text)
    price = Column(DECIMAL(10, 2), nullable=False)
    image_url = Column(String(255))
    
    # Relationships
    menu = relationship("Menu", back_populates="menu_items")
    order_items = relationship("OrderItems", back_populates="menu_item")

class Order(Base):
    __tablename__ = 'order'
    
    order_id = Column(Integer, primary_key=True, autoincrement=True)
    customer_id = Column(Integer, ForeignKey('customer.customer_id', ondelete='CASCADE'))
    total_price = Column(DECIMAL(10, 2), nullable=False)
    status = Column(Enum('pending', 'confirmed', 'delivered', 'cancelled'), nullable=False)
    order_date = Column(TIMESTAMP, default=func.current_timestamp())
    
    # Relationships
    customer = relationship("Customer", back_populates="orders")
    order_items = relationship("OrderItems", back_populates="order", cascade="all, delete-orphan")
    payment = relationship("Payment", back_populates="order", uselist=False, cascade="all, delete-orphan")
    delivery = relationship("Delivery", back_populates="order", uselist=False, cascade="all, delete-orphan")

class OrderItems(Base):
    __tablename__ = 'orderitems'
    
    order_item_id = Column(Integer, primary_key=True, autoincrement=True)
    order_id = Column(Integer, ForeignKey('order.order_id', ondelete='CASCADE'))
    item_id = Column(Integer, ForeignKey('menuitem.item_id', ondelete='CASCADE'))
    quantity = Column(Integer, nullable=False)
    price = Column(DECIMAL(10, 2), nullable=False)
    
    # Relationships
    order = relationship("Order", back_populates="order_items")
    menu_item = relationship("MenuItem", back_populates="order_items")

class Payment(Base):
    __tablename__ = 'payment'
    
    payment_id = Column(Integer, primary_key=True, autoincrement=True)
    order_id = Column(Integer, ForeignKey('order.order_id', ondelete='CASCADE'))
    payment_method = Column(Enum('credit_card', 'mobile_money', 'cash'), nullable=False)
    amount = Column(DECIMAL(10, 2), nullable=False)
    payment_status = Column(Enum('pending', 'completed', 'failed'), nullable=False)
    
    # Relationships
    order = relationship("Order", back_populates="payment")

class Delivery(Base):
    __tablename__ = 'delivery'
    
    delivery_id = Column(Integer, primary_key=True, autoincrement=True)
    order_id = Column(Integer, ForeignKey('order.order_id', ondelete='CASCADE'))
    delivery_personnel_id = Column(Integer, ForeignKey('user.user_id', ondelete='SET NULL'))
    delivery_address = Column(String(255), nullable=False)
    delivery_status = Column(Enum('pending', 'out_for_delivery', 'delivered'), nullable=False)
    estimated_time = Column(TIMESTAMP)
    
    # Relationships
    order = relationship("Order", back_populates="delivery")
    delivery_personnel = relationship("User", back_populates="deliveries")

class TableReservation(Base):
    __tablename__ = 'tablereservation'
    
    reservation_id = Column(Integer, primary_key=True, autoincrement=True)
    customer_id = Column(Integer, ForeignKey('customer.customer_id', ondelete='CASCADE'))
    table_number = Column(Integer, nullable=False)
    reservation_date = Column(TIMESTAMP, nullable=False)
    status = Column(Enum('pending', 'confirmed', 'cancelled'), nullable=False)
    
    # Relationships
    customer = relationship("Customer", back_populates="reservations")

 
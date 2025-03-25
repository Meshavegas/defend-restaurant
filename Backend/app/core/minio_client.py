# app/core/minio_client.py
from minio import Minio
from fastapi import UploadFile
import io
from datetime import timedelta

class MinioClient:
    def __init__(self):
        self.client = Minio(
            "minio:9000",  # adjust host:port as needed
            access_key="xnnvo0Btj8UDtR3GC1vw",  # replace with your access key
            secret_key="vjsHLJvjaGnOOER2QqqQXebKWQDb47PGfKL3vgze",  # replace with your secret key
            secure=False  # set to True if using HTTPS
        )
        self.bucket_name = "restaurant"

    async def upload_file(self, file: UploadFile, object_name: str) -> str:
        try:
            # Ensure bucket exists
            if not self.client.bucket_exists(self.bucket_name):
                self.client.make_bucket(self.bucket_name)

            # Read file content
            content = await file.read()
            file_size = len(content)
            file_data = io.BytesIO(content)

            # Upload file
            self.client.put_object(
                self.bucket_name,
                object_name,
                file_data,
                file_size,
                file.content_type
            )

            # Generate URL
            url = self.client.presigned_get_object(
                self.bucket_name,
                object_name,
                expires=timedelta(days=7)
            )
            return url

        except Exception as e:
            raise Exception(f"Failed to upload file to MinIO: {str(e)}")

    def delete_file(self, object_name: str):
        try:
            self.client.remove_object(self.bucket_name, object_name)
        except Exception as e:
            raise Exception(f"Failed to delete file from MinIO: {str(e)}")
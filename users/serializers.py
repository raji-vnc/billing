from rest_framework import serializers
from django.contrib.auth.models import User

class RegisterSerializer(serializers.ModelSerializer):
    password=serializers.CharField(write_only=True)
    class Meta:
        model=User
        fields=['id','username','password']

        def create(self,validate_data):
            return User.objects.create_user(
                username=validate_data['username'],
                password=validate_data['password']
            )
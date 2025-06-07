from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["first_name", "last_name", "id", "username", "email", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

    def validate_first_name(self, value):
        import re
        if not (2 <= len(value) <= 50):
            raise serializers.ValidationError("First name must be between 2 and 50 characters.")
        if not re.match(r"[A-Za-zżźćńółęąśŻŹĆĄŚĘŁÓŃ]+(?:[-'_.\s][A-Za-zżźćńółęąśŻŹĆĄŚĘŁÓŃ]+)*$", value):
            raise serializers.ValidationError("First name must start with a capital letter and contain only letters, spaces, apostrophes, or hyphens.")
        return value
    
    def validate_last_name(self, value):
        import re
        if not (2 <= len(value) <= 50):
            raise serializers.ValidationError("Last name must be between 2 and 50 characters.")
        if not re.match(r"[A-Za-zżźćńółęąśŻŹĆĄŚĘŁÓŃ]+(?:[-'_.\s][A-Za-zżźćńółęąśŻŹĆĄŚĘŁÓŃ]+)*$", value):
            raise serializers.ValidationError("Last name must start with a capital letter and contain only letters, spaces, apostrophes, or hyphens.")
        return value
    
    def validate_password(self, value):
        import re
        if not (6 <= len(value) <= 50):
            raise serializers.ValidationError("Password must be between 6 and 50 characters.")
        if not re.match(r"^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#&()\[{}\]:;',?/*~$^+=<>-]).{6,50}$", value):
            raise serializers.ValidationError("Password must contain one lower and upper case letter, one number and one special character.")
        return value
    
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        # The default result (access/refresh tokens)
        data = super(CustomTokenObtainPairSerializer, self).validate(attrs)
        # Custom data you want to include
        data.update({'username': self.user.username})
        data.update({'first_name': self.user.first_name})
        # and everything else you want to send in the response
        return data


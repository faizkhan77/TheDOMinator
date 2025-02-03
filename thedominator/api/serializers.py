from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile, Team, Room, Message


class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer for UserProfile model"""

    teams = serializers.PrimaryKeyRelatedField(
        queryset=Team.objects.all(), many=True, required=False
    )  # Set required=False

    class Meta:
        model = UserProfile
        fields = [
            "id",
            "user",
            "teams",
            "full_name",
            "avatar",
            "role",
            "skills",
            "experience",
            "github",
            "linkedin",
            "instagram",
            "portfolio",
            "created",
            "updated",
        ]
        read_only_fields = ["created", "updated"]


class UserSerializer(serializers.ModelSerializer):
    """Serializer for Django User model, including the profile"""

    profile = UserProfileSerializer()  # Nesting UserProfile data

    class Meta:
        model = User
        fields = ["id", "username", "email", "profile"]


class TeamSerializer(serializers.ModelSerializer):
    """Serializer for Team model"""

    admin = UserSerializer(read_only=True)  # Display admin details
    members = UserSerializer(many=True, read_only=True)  # Display member details
    chatroom_id = serializers.IntegerField(
        source="chatroom.id", read_only=True
    )  # Chatroom ID

    class Meta:
        model = Team
        fields = [
            "id",
            "name",
            "admin",
            "description",
            "project_idea",
            "looking_for",
            "members",
            "members_limit",
            "chatroom_id",
            "created",
            "updated",
        ]
        read_only_fields = ["created", "updated"]


class RoomSerializer(serializers.ModelSerializer):
    """Serializer for Room model"""

    team = serializers.PrimaryKeyRelatedField(
        queryset=Team.objects.all()
    )  # Store only team ID
    admin = UserSerializer(read_only=True)
    members = UserSerializer(many=True, read_only=True)

    class Meta:
        model = Room
        fields = ["id", "team", "admin", "room_type", "members", "created"]
        read_only_fields = ["created"]


class MessageSerializer(serializers.ModelSerializer):
    """Serializer for Chat Messages"""

    sender = UserSerializer(read_only=True)  # Show sender details
    room = serializers.PrimaryKeyRelatedField(
        queryset=Room.objects.all()
    )  # Store only room ID

    class Meta:
        model = Message
        fields = ["id", "room", "sender", "content", "timestamp"]
        read_only_fields = ["timestamp"]

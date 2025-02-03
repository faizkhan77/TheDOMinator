from rest_framework import viewsets, permissions
from django.contrib.auth.models import User
from .models import UserProfile, Team, Room, Message
from .serializers import (
    UserSerializer,
    UserProfileSerializer,
    TeamSerializer,
    RoomSerializer,
    MessageSerializer,
)
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth import authenticate
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404


@api_view(["POST"])
@permission_classes([AllowAny])  # Allows access without authentication
def signup_view(request):
    username = request.data.get("username")
    # email = request.data.get("email")
    password = request.data.get("password")
    confirm_password = request.data.get("confirm_password")

    if password != confirm_password:
        return Response({"error": "Passwords do not match"}, status=400)

    if User.objects.filter(username=username).exists():
        return Response({"error": "Username already taken"}, status=400)

    user = User.objects.create_user(username=username, password=password)
    user.save()

    # Automatically log in the user after signup
    refresh = RefreshToken.for_user(user)
    return Response(
        {
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
            },
        }
    )


@api_view(["POST"])
@permission_classes([AllowAny])  # Allows access without authentication
def login_view(request):
    username = request.data.get("username")
    password = request.data.get("password")

    user = authenticate(username=username, password=password)
    if user is not None:
        refresh = RefreshToken.for_user(user)
        return Response(
            {
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                },
            }
        )
    return Response({"error": "Invalid Credentials"}, status=400)


# ✅ User ViewSet (Handles User & Profile)
class UserViewSet(viewsets.ReadOnlyModelViewSet):
    """Handles listing and retrieving users (Read-Only)"""

    queryset = User.objects.all()
    serializer_class = UserSerializer
    # permission_classes = [permissions.IsAuthenticated]


# ✅ User Profile ViewSet (Handles Profile CRUD)
class UserProfileViewSet(viewsets.ModelViewSet):
    """Handles CRUD for user profiles"""

    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def retrieve(self, request, *args, **kwargs):
        print("\n🔹 retrieve() method called!")  # Debugging output
        print("Authorization Header:", request.headers.get("Authorization"))
        print("Authenticated User:", request.user)

        response = super().retrieve(request, *args, **kwargs)
        print("Response Data:", response.data)  # Log the response data here
        return response


# ✅ Team ViewSet
class TeamViewSet(viewsets.ModelViewSet):
    """Handles CRUD for teams"""

    queryset = Team.objects.all()
    serializer_class = TeamSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        """Ensure the logged-in user becomes the admin and is added to the team."""
        user = self.request.user  # Get logged-in user
        team = serializer.save(admin=user)  # Assign admin

        # Automatically add the admin as a member
        team.members.add(user)

    @action(detail=True, methods=["post"])
    def join(self, request, pk=None):
        """Allow a user to join a team if there's space."""
        team = self.get_object()
        user = request.user

        # Check if user is already a member
        if user in team.members.all():
            return Response(
                {"detail": "You are already a member."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Check if team is full
        if team.members.count() >= team.members_limit:
            return Response(
                {"detail": "Team is full."}, status=status.HTTP_400_BAD_REQUEST
            )

        # Add user to the team
        team.members.add(user)
        return Response({"detail": "Joined successfully!"}, status=status.HTTP_200_OK)

    @action(detail=True, methods=["post"])
    def leave(self, request, pk=None):
        """Allow a user to leave the team."""
        team = self.get_object()
        user = request.user

        # Check if user is in the team
        if user not in team.members.all():
            return Response(
                {"detail": "You are not a member of this team."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Prevent the admin from leaving (unless another admin is assigned)
        if user == team.admin:
            return Response(
                {"detail": "Admin cannot leave the team."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Remove user from the team
        team.members.remove(user)
        return Response(
            {"detail": "You have left the team."}, status=status.HTTP_200_OK
        )


# ✅ Room (Chatroom) ViewSet
class RoomViewSet(viewsets.ModelViewSet):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=True, methods=["get"])
    def messages(self, request, pk=None):
        """Fetch messages for a specific chatroom"""
        room = self.get_object()
        messages = (
            room.messages.all()
        )  # Assuming a related_name='messages' in Message model
        return Response(
            MessageSerializer(messages, many=True).data, status=status.HTTP_200_OK
        )


# ✅ Message ViewSet (For Chat Messages)
class MessageViewSet(viewsets.ModelViewSet):
    """Handles CRUD for chat messages"""

    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Filter messages based on room ID"""
        room_id = self.request.query_params.get("room")  # Get 'room' from query params
        if room_id:
            return Message.objects.filter(room_id=room_id).order_by("timestamp")
        return Message.objects.none()  # Return empty if no room ID provided

    def perform_create(self, serializer):
        """Set sender automatically from authenticated user"""
        serializer.save(sender=self.request.user)


@api_view(["GET"])
def getRoutes(request):
    """Returns a list of available API endpoints."""
    routes = [
        # Users
        {"GET": "/api/users/"},
        {"GET": "/api/users/{id}/"},
        # Profiles
        {"GET": "/api/profiles/"},
        {"GET": "/api/profiles/{id}/"},
        {"PUT": "/api/profiles/{id}/"},
        {"DELETE": "/api/profiles/{id}/"},
        # Teams
        {"GET": "/api/teams/"},
        {"POST": "/api/teams/"},
        {"GET": "/api/teams/{id}/"},
        {"PUT": "/api/teams/{id}/"},
        {"DELETE": "/api/teams/{id}/"},
        # Chat Rooms
        {"GET": "/api/rooms/"},
        {"POST": "/api/rooms/"},
        {"GET": "/api/rooms/{id}/"},
        {"PUT": "/api/rooms/{id}/"},
        {"DELETE": "/api/rooms/{id}/"},
        # Messages
        {"GET": "/api/messages/"},
        {"POST": "/api/messages/"},
        {"GET": "/api/messages/{id}/"},
        {"PUT": "/api/messages/{id}/"},
        {"DELETE": "/api/messages/{id}/"},
    ]
    return Response(routes)


@api_view(["POST"])
def kick_member_from_team(request, team_id):
    """Kick a member from the team (only accessible by the admin)."""
    if not request.user.is_authenticated:
        return Response(
            {"detail": "Authentication required."}, status=status.HTTP_401_UNAUTHORIZED
        )

    team = get_object_or_404(Team, id=team_id)
    member_id = request.data.get("memberId")

    # Ensure the requesting user is the admin of the team
    if team.admin.id != request.user.id:
        return Response(
            {"detail": "You do not have permission to kick members."},
            status=status.HTTP_403_FORBIDDEN,
        )

    member = get_object_or_404(User, id=member_id)

    # Check if the member is actually in the team
    if member not in team.members.all():
        return Response(
            {"detail": "Member not found in the team."},
            status=status.HTTP_404_NOT_FOUND,
        )

    # Remove the member from the team
    team.members.remove(member)

    return Response(
        {"detail": "Member kicked successfully."}, status=status.HTTP_200_OK
    )

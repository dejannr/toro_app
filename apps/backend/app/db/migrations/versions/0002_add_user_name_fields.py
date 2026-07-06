"""add user name fields

Revision ID: 0002_add_user_name_fields
Revises: 0001_create_users
Create Date: 2026-07-06 00:00:00.000000
"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = "0002_add_user_name_fields"
down_revision: str | None = "0001_create_users"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.add_column("users", sa.Column("first_name", sa.String(length=100)))
    op.add_column("users", sa.Column("last_name", sa.String(length=100)))
    op.execute("UPDATE users SET first_name = '', last_name = ''")
    op.alter_column("users", "first_name", nullable=False)
    op.alter_column("users", "last_name", nullable=False)


def downgrade() -> None:
    op.drop_column("users", "last_name")
    op.drop_column("users", "first_name")

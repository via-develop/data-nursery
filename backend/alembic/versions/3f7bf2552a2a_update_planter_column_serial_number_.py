"""update Planter Column serial_number Unique=True

Revision ID: 3f7bf2552a2a
Revises: fea6697c073f
Create Date: 2023-08-29 21:33:36.223800

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '3f7bf2552a2a'
down_revision: Union[str, None] = 'fea6697c073f'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_unique_constraint(None, 'planters', ['serial_number'])
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, 'planters', type_='unique')
    # ### end Alembic commands ###
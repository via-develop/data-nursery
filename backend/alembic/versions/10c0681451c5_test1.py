"""test1

Revision ID: 10c0681451c5
Revises: aeca64e7e4dd
Create Date: 2023-08-22 22:37:54.296074

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '10c0681451c5'
down_revision: Union[str, None] = 'aeca64e7e4dd'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('planters', sa.Column('moya', sa.Integer(), nullable=True))
    op.drop_constraint('planters_farm_house_id_id_fkey', 'planters', type_='foreignkey')
    op.create_foreign_key(None, 'planters', 'farm_houses', ['moya'], ['id'])
    op.drop_column('planters', 'farm_house_id_id')
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('planters', sa.Column('farm_house_id_id', sa.INTEGER(), autoincrement=False, nullable=True))
    op.drop_constraint(None, 'planters', type_='foreignkey')
    op.create_foreign_key('planters_farm_house_id_id_fkey', 'planters', 'farm_houses', ['farm_house_id_id'], ['id'])
    op.drop_column('planters', 'moya')
    # ### end Alembic commands ###

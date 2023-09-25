"""update Farmhouse table name, farmhouse_id, producer_name nullable True 추가

Revision ID: 1e56efb59c34
Revises: d8b81bcec7aa
Create Date: 2023-09-25 20:09:44.856836

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '1e56efb59c34'
down_revision: Union[str, None] = 'd8b81bcec7aa'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index('ix_farm_houses_farm_house_id', table_name='farm_houses')
    op.drop_index('ix_farm_houses_name', table_name='farm_houses')
    op.drop_index('ix_farm_houses_producer_name', table_name='farm_houses')
    op.create_unique_constraint(None, 'farm_houses', ['name'])
    op.create_unique_constraint(None, 'farm_houses', ['farm_house_id'])
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, 'farm_houses', type_='unique')
    op.drop_constraint(None, 'farm_houses', type_='unique')
    op.create_index('ix_farm_houses_producer_name', 'farm_houses', ['producer_name'], unique=False)
    op.create_index('ix_farm_houses_name', 'farm_houses', ['name'], unique=False)
    op.create_index('ix_farm_houses_farm_house_id', 'farm_houses', ['farm_house_id'], unique=False)
    # ### end Alembic commands ###

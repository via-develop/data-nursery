"""delete PlanterOutput column output

Revision ID: 274085eaeab3
Revises: 03bfdc1bb312
Create Date: 2023-08-24 18:21:43.455923

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '274085eaeab3'
down_revision: Union[str, None] = '03bfdc1bb312'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('planter_outputs', 'output')
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('planter_outputs', sa.Column('output', sa.INTEGER(), autoincrement=False, nullable=True))
    # ### end Alembic commands ###

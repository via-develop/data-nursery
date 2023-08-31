"""regenerate all

Revision ID: 6f436f9ac9d7
Revises: 
Create Date: 2023-08-30 22:25:39.222611

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '6f436f9ac9d7'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('crops',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=255), nullable=True),
    sa.Column('image', sa.String(), nullable=True),
    sa.Column('color', sa.String(length=10), nullable=True),
    sa.Column('is_del', sa.Boolean(), nullable=True),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
    sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_crops_id'), 'crops', ['id'], unique=False)
    op.create_index(op.f('ix_crops_name'), 'crops', ['name'], unique=False)
    op.create_table('planter_trays',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('width', sa.Integer(), nullable=True),
    sa.Column('height', sa.Integer(), nullable=True),
    sa.Column('total', sa.Integer(), nullable=True),
    sa.Column('is_del', sa.Boolean(), nullable=True),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
    sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_planter_trays_id'), 'planter_trays', ['id'], unique=False)
    op.create_table('users',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('login_id', sa.String(length=20), nullable=True),
    sa.Column('password', sa.String(), nullable=True),
    sa.Column('name', sa.String(length=20), nullable=True),
    sa.Column('code', sa.String(length=2), nullable=True),
    sa.Column('is_del', sa.Boolean(), nullable=True),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
    sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_users_id'), 'users', ['id'], unique=False)
    op.create_index(op.f('ix_users_login_id'), 'users', ['login_id'], unique=True)
    op.create_table('farm_houses',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=255), nullable=True),
    sa.Column('nursery_number', sa.String(length=244), nullable=True),
    sa.Column('farm_house_id', sa.String(length=20), nullable=True),
    sa.Column('producer_name', sa.String(length=20), nullable=True),
    sa.Column('address', sa.Text(), nullable=True),
    sa.Column('owner_id', sa.Integer(), nullable=True),
    sa.Column('phone', sa.String(length=20), nullable=True),
    sa.Column('is_del', sa.Boolean(), nullable=True),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
    sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
    sa.ForeignKeyConstraint(['owner_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_farm_houses_farm_house_id'), 'farm_houses', ['farm_house_id'], unique=True)
    op.create_index(op.f('ix_farm_houses_id'), 'farm_houses', ['id'], unique=False)
    op.create_index(op.f('ix_farm_houses_name'), 'farm_houses', ['name'], unique=True)
    op.create_index(op.f('ix_farm_houses_nursery_number'), 'farm_houses', ['nursery_number'], unique=True)
    op.create_index(op.f('ix_farm_houses_producer_name'), 'farm_houses', ['producer_name'], unique=False)
    op.create_table('planters',
    sa.Column('farm_house_id', sa.Integer(), nullable=True),
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('serial_number', sa.String(length=255), nullable=True),
    sa.Column('is_register', sa.Boolean(), nullable=True),
    sa.Column('register_date', sa.DateTime(timezone=True), nullable=True),
    sa.Column('qrcode', sa.String(), nullable=True),
    sa.Column('is_del', sa.Boolean(), nullable=True),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
    sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
    sa.ForeignKeyConstraint(['farm_house_id'], ['farm_houses.id'], ),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('serial_number')
    )
    op.create_index(op.f('ix_planters_id'), 'planters', ['id'], unique=False)
    op.create_table('planter_status',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('planter_id', sa.Integer(), nullable=True),
    sa.Column('status', sa.String(length=5), nullable=True),
    sa.Column('is_del', sa.Boolean(), nullable=True),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
    sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
    sa.ForeignKeyConstraint(['planter_id'], ['planters.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_planter_status_id'), 'planter_status', ['id'], unique=False)
    op.create_table('planter_works',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('planter_id', sa.Integer(), nullable=True),
    sa.Column('planter_tray_id', sa.Integer(), nullable=True),
    sa.Column('crop_id', sa.Integer(), nullable=True),
    sa.Column('crop_kind', sa.String(length=255), nullable=True),
    sa.Column('sowing_date', sa.DateTime(timezone=True), nullable=True),
    sa.Column('deadline', sa.DateTime(timezone=True), nullable=True),
    sa.Column('order_quantity', sa.BigInteger(), nullable=True),
    sa.Column('seed_quantity', sa.BigInteger(), nullable=True),
    sa.Column('operating_time', sa.BigInteger(), nullable=True),
    sa.Column('is_del', sa.Boolean(), nullable=True),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
    sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
    sa.ForeignKeyConstraint(['crop_id'], ['crops.id'], ),
    sa.ForeignKeyConstraint(['planter_id'], ['planters.id'], ),
    sa.ForeignKeyConstraint(['planter_tray_id'], ['planter_trays.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_planter_works_crop_kind'), 'planter_works', ['crop_kind'], unique=False)
    op.create_index(op.f('ix_planter_works_id'), 'planter_works', ['id'], unique=False)
    op.create_table('planter_outputs',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('planter_work_id', sa.Integer(), nullable=True),
    sa.Column('output', sa.BigInteger(), nullable=True),
    sa.Column('is_del', sa.Boolean(), nullable=True),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
    sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
    sa.ForeignKeyConstraint(['planter_work_id'], ['planter_works.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_planter_outputs_id'), 'planter_outputs', ['id'], unique=False)
    op.create_table('planter_work_status',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('planter_work_id', sa.Integer(), nullable=True),
    sa.Column('status', sa.String(length=7), nullable=True),
    sa.Column('is_del', sa.Boolean(), nullable=True),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
    sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
    sa.ForeignKeyConstraint(['planter_work_id'], ['planter_works.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_planter_work_status_id'), 'planter_work_status', ['id'], unique=False)
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f('ix_planter_work_status_id'), table_name='planter_work_status')
    op.drop_table('planter_work_status')
    op.drop_index(op.f('ix_planter_outputs_id'), table_name='planter_outputs')
    op.drop_table('planter_outputs')
    op.drop_index(op.f('ix_planter_works_id'), table_name='planter_works')
    op.drop_index(op.f('ix_planter_works_crop_kind'), table_name='planter_works')
    op.drop_table('planter_works')
    op.drop_index(op.f('ix_planter_status_id'), table_name='planter_status')
    op.drop_table('planter_status')
    op.drop_index(op.f('ix_planters_id'), table_name='planters')
    op.drop_table('planters')
    op.drop_index(op.f('ix_farm_houses_producer_name'), table_name='farm_houses')
    op.drop_index(op.f('ix_farm_houses_nursery_number'), table_name='farm_houses')
    op.drop_index(op.f('ix_farm_houses_name'), table_name='farm_houses')
    op.drop_index(op.f('ix_farm_houses_id'), table_name='farm_houses')
    op.drop_index(op.f('ix_farm_houses_farm_house_id'), table_name='farm_houses')
    op.drop_table('farm_houses')
    op.drop_index(op.f('ix_users_login_id'), table_name='users')
    op.drop_index(op.f('ix_users_id'), table_name='users')
    op.drop_table('users')
    op.drop_index(op.f('ix_planter_trays_id'), table_name='planter_trays')
    op.drop_table('planter_trays')
    op.drop_index(op.f('ix_crops_name'), table_name='crops')
    op.drop_index(op.f('ix_crops_id'), table_name='crops')
    op.drop_table('crops')
    # ### end Alembic commands ###
# FastAPI 실행방법

## 1. `.env` 파일 준비

- `.env` 파일 구글드라이브(`VIA Platform / 2023 / 06. 자동파종기 / FastAPI`)에서 다운로드
- `data-nursery/backend` 경로에 `.env` 파일 이동
- `.env` 파일 수정

```
DATABASE_URL="postgresql://dpbell:mnb30217@{내부 ip 주소}:5120/fastapi_test"
CORS_ORIGINS="http://192.168.2.100:3000, http://localhost:3000"
...
```

- `DATABASE_URL`에 사용한 postgres user(dpbell)와 password(mnb30217), db name(fastpi_test)은 docker-compose.dev.yrml 파일과 맞춰서 변경 가능
- `DATABASE_URL`의 `{내부 ip 주소}`를 각자 환경에 맞게 변경
- `CORS_ORIGINS`의 ip 목록에 본인 ip 주소 수정 또는 추가

<br/>

## 2. 사용한 Python 버전 및 패키지 다운로드

- 사용한 Python version : `3.10.12`
- Python 패키지 다운로드

```
# root directory(~/data-nursery)에서 실행

$ pip install -r backend/requirements/base.txt

# Mac 에서 lightgbm 패키지 설치 오류 발생 시

- 로컬에 OpenMP 설치
- LightGBM은 기본적으로 로컬에 설치된 OpenMP를 찾아 동적으로 연결한다고 함
$ brew install libomp
```

<br/>

## 3. FastAPI 실행

- `~/data-nursery/backend` 경로(`main.py` 파일이 있는 경로)에서 실행

```
$ uvicorn main:app --host 0.0.0.0 --reload
```

<br/>
<br/>
<br/>
<br/>
<br/>
<br/>

# Alembic 사용법

- models.py 파일 생성 시 alembic/env.py 파일에 해당 경로 작성해주어야함
  AppModelBase.metadata 자체적으로 모델에대해서는 모르기 때문에 생성한 models 파일들을 연결해줘야한다.

- 마이그레이션 파일 생성

```
alembic revision --autogenerate -m "commit message"
```

- 마이그레이션 파일 DB에 적용

```
alembic upgrade head
```

- alembic head 위치 변경

```
# alembic stamp <revision>
alembic stamp head
```

<p align="center">
<img width="500" alt="ChatGPT_Image_2025_12_30_11_24_18" src="https://github.com/user-attachments/assets/6857892f-f320-48f8-8ee4-4be17a77fc10" />

# 

## 📍👨‍💻👩‍💻**Team introduction**

### - 👨‍💻 [권민석](https://github.com/RIMIN0650) — Backend
### - 👩‍💻 [김미정](https://github.com/mihub02) — Backend
### - 👨‍💻 [노승찬](https://github.com/seungchan-0629) — Backend
### - 👨‍💻 [이한별](https://github.com/sole0714) — Backend

## 📍 위치 기반 주변 병원 정보, 대기 현황 조회 및 예약

> 지역 기반 공동구매 매칭 플랫폼을 통한
1인 가구 생활비 절감과 동네 커뮤니티 활성화
> 

혼자서 감당하기 힘든 소비와 활동을

동네 사람들과 함께 **‘사고 · 쓰고 · 모이는’**

생활 밀착형 지역 플랫폼

## 📍 프로젝트 소개

본 프로젝트는 **GPS 기반 지역 인증**을 활용한

**동네 중심 공동구매 매칭 플랫폼**이다.

대용량 소비, 혼자 하기 어려운 활동,

단절된 이웃 관계라는 문제를 해결하기 위해

공동구매를 매개로 **사람과 생활을 연결하는 구조**를 제안한다.

## 📍 기술스택
### DATABASE
![mariadb](https://img.shields.io/badge/MariaDB-003545?style=for-the-badge&logo=mariadb&logoColor=white) ![mysql](https://img.shields.io/badge/MySQL-00000F?style=for-the-badge&logo=mysql&logoColor=white) 

### TRAFFIC MANAGEMENT
![grafana](https://img.shields.io/badge/grafana-%23F46800.svg?style=for-the-badge&logo=grafana&logoColor=white) ![Prometheus](https://img.shields.io/badge/Prometheus-E6522C?style=for-the-badge&logo=Prometheus&logoColor=white) 
![haproxy](https://camo.githubusercontent.com/6bcf8603439a2934f709666a80c2ffdac14d64552d02e5fa1219a2a6f38428ad/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f484150726f78792d3145393046463f7374796c653d666f722d7468652d6261646765266c6f676f3d686170726f7879266c6f676f436f6c6f723d7768697465) ![JMeter](https://img.shields.io/badge/JMeter-D22128?style=for-the-badge&logo=apachejmeter&logoColor=white)

### COLLABORATION
![github](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white) ![NOTION](https://img.shields.io/badge/Notion-000000?style=for-the-badge&logo=notion&logoColor=white)



## 📍 프로젝트 기획안

 [Google Docs 기획안](https://docs.google.com/document/d/1VzyXLjJqwQZyX-jUeKYUx8Nn9bLWR6anQaBtFDBwXP8/edit?tab=t.0)



## 📍 요구사항 정의서

[요구사항 정의서](https://docs.google.com/spreadsheets/d/1vy4meR1GHU6tSzcL6rbRh7OsKovU3FEhKYtpDsHK8-s/edit?usp=sharing)



## 📍 ERD
<details>
<summary>ERD 펼쳐보기</summary>

<p align="center">
  <img width="1652" height="1338" alt="ERD" src="https://github.com/user-attachments/assets/4872f5d6-79b2-484b-ad6f-3a3381a442f0" />



</p>

</details>

## 📍 시스템 아키텍처
<details>
<summary>시스템 아키텍쳐 펼쳐보기</summary>

<p align="center">
 <img width="1054" height="612" alt="시스템 아키텍처" src="https://github.com/user-attachments/assets/0fd29bde-6391-4be1-a710-3a3b1c1f21c8" />



본 구조에서는 HAProxy를 DB 접근의 단일 진입점으로 두어 쓰기 트래픽은 Master DB로 직접 전달하고, 읽기 트래픽은 Slave DB 풀로 분산 처리하였다. 이를 통해 조회 부하를 분산시키고 Master DB를 보호함으로써 성능 저하 및 병목 현상을 방지하도록 설계하였다.
</details>

## 📍 부하 테스트 전/후
<details>
<summary>부하 테스트 전 펼쳐보기</summary>

Max number of connections : 20
Number of threads : 2000

list 테이블
<img width="940" height="51" alt="image" src="https://github.com/user-attachments/assets/9e218f62-d597-42d7-b081-1df7fed7bf01" />

SELECT DISTINCT u.idx, u.email
FROM list l
JOIN user u
ON l.user_idx = u.idx
WHERE l.post_area LIKE 'seoul%'
  AND l.price >= 10000;


payment 테이블
<img width="940" height="54" alt="image" src="https://github.com/user-attachments/assets/2f1235d9-0a82-498c-bbba-a36535b9f093" />

SELECT p.idx, p.card_company, p.pay_status, p.created_at, u.email
FROM payment p
JOIN user u
ON p.user_idx = u.idx
WHERE p.pay_status = 'COMPLETE'
ORDER BY p.created_at DESC;


profile 테이블
<img width="940" height="117" alt="image" src="https://github.com/user-attachments/assets/2495116b-573c-49b9-ab22-bc3146d69a52" />

SELECT name, nickname, gender, birthdate, phone_nember, user_area, bio, profile_image
FROM profile
WHERE user_idx = 5;



review 테이블
<img width="940" height="60" alt="image" src="https://github.com/user-attachments/assets/d9c5b3cd-122f-45e6-9b22-5961702f20ef" />






</details>

<details>
<summary>부하 테스트 후 펼쳐보기</summary>

list 테이블
<img width="940" height="82" alt="image" src="https://github.com/user-attachments/assets/022824a9-36f0-4082-9c46-3cfbdb599722" />

SELECT u.idx, u.email
FROM user u
JOIN (
    SELECT user_idx
    FROM list
    WHERE post_area LIKE 'seoul%'
      AND price >= 10000SELECT
    GROUP BY user_idx
) l
ON u.idx = l.user_idx;

## 4️⃣ 추가 성능 개선 예시

### 성능 개선
| 지표 | 개선 전 | 개선 후 | 향상율 |
|------|---------|---------|--------|
| 평균 응답 시간 (Average) | 22054 ms | 19183 ms | ✅ **13% 감소** |
| 처리량 (Throughput) | 13.0/sec | 46.9/sec | 🚀 **260% 증가** |




payment 테이블
<img width="940" height="62" alt="image" src="https://github.com/user-attachments/assets/98e3ea3b-1d24-4486-9fd5-7722c6d3ad3f" />

SELECT p.idx, p.card_company, p.pay_status, p.created_at, u.email 
FROM payment p JOIN user u ON p.user_idx = u.idx
WHERE p.pay_status = 'COMPLETE' ORDER BY p.created_at DESC;

| 지표                 | 개선 전      | 개선 후      | 향상율            |
| ------------------ | --------- | --------- | -------------- |
| 평균 응답 시간 (Average) | 8213 ms   | 56 ms     | ✅ **98% 감소**   |
| 처리량 (Throughput)   | 112.5/sec | 994.0/sec | 🚀 **783% 증가** |



profile 테이블
<img width="940" height="54" alt="image" src="https://github.com/user-attachments/assets/9b774f11-d8ef-4720-b4fa-af74d7c03941" />

SELECT name, nickname, gender, birthdate, phone_nember, user_area, bio, profile_image
FROM profile
WHERE user_idx = 5;

| 지표                 | 개선 전     | 개선 후      | 향상율            |
| ------------------ | -------- | --------- | -------------- |
| 평균 응답 시간 (Average) | 12237 ms | 370 ms    | ✅ **96% 감소**   |
| 처리량 (Throughput)   | 92.2/sec | 840.0/sec | 🚀 **811% 증가** |



review 테이블
<img width="940" height="58" alt="image" src="https://github.com/user-attachments/assets/30f0bc8f-b44d-4922-acb0-25ce3b7ca140" />


| 지표                 | 개선 전      | 개선 후      | 향상율           |
| ------------------ | --------- | --------- | ------------- |
| 평균 응답 시간 (Average) | 484 ms    | 84 ms     | ✅ **82% 감소**  |
| 처리량 (Throughput)   | 802.9/sec | 990.1/sec | 🚀 **23% 증가** |






</details>






























































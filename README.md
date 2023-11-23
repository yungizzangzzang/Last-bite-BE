# Last-bite
- 프로젝트의 주요 내용은 대용량 트래픽 처리, 동시성 제어, 검색 기능 최적화 입니다.
- 재고 소진에 어려움을 겪는 음식점 그리고, 음식을 저렴하게 구매하고 싶은 손님 양자 모두를 위한 '마감 할인 서비스'를 기획하였습니다.
  
<p align="center">  
  <img width="500" alt="last-bite" src="https://github.com/yungizzangzzang/Last-bite-BE/assets/115535910/6cb00d9c-2609-471e-ab23-fead3d41ce78">
</p>

### 프로젝트의 기능은 다음과 같습니다.
---
### 1. 쿠버네티스를 활용한 효율적인 리소스 관리
<p align="center"> 
  <img width="500" alt="last-bite-architecture_ver3" src="https://github.com/yungizzangzzang/Last-bite-BE/assets/115535910/bf75d67f-c0db-4eca-ba92-9671fbca2fa4">
</p>  
- HPA(Horizontal Pod Autoscaler)를 도입하여 CPU 사용량에 기반한 자동 스케일링을 구현, 트래픽 변동에 유연하게 대응하여 항상 최적의 리소스 사용률을 유지.
- 실시간 모니터링을 통해 시스템의 건강 상태를 지속적으로 추적하고, 개발자가 부재중일 시 알람을 통해 빠른 대처가 가능하게 함.

---
### 2. 소켓 IO를 활용한 실시간 알림 기능
| 주문하기 | 알림보내기 |
|:-:|:-:|
| ![주문하기](https://github.com/yungizzangzzang/Last-bite-BE/assets/115535910/6722a917-1575-4228-b7aa-1892ffc7e04d) | ![알림보내기](https://github.com/yungizzangzzang/Last-bite-BE/assets/115535910/562c7ce0-5b4d-4dab-8455-329601fab981) |

---
### 3. Redis를 사용한 빠르고 정확한 예약 서비스.
<p align="center"> 
  <img width="500" alt="sequence_diagram ver 3 0" src="https://github.com/yungizzangzzang/Last-bite-BE/assets/115535910/41b664d6-8590-4985-a664-c90dc3fff847">
</p>

---
### 4. 현재 위치를 기반으로 한 음식점 조회 기능. 10가지 카테고리를 기반으로 원하는 종류의 가게를 가까운 순으로 조회

---
### 5. 가게의 핫딜 등록 및 예약 관리. 별도의 가게 관리 페이지에서 핫딜 상품의 수월한 등록 및 예약 관리를 지원.
<p align="center"> 
    <img width="500" alt="sequence_diagram ver 3 0" src="https://github.com/yungizzangzzang/Last-bite-BE/assets/115535910/0a2afba5-1c0f-4e93-8f58-5d3876a49c15">
</p>

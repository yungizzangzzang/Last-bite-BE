# Last-bite
( 2023.10 ~ 2023.11, 6주 )

- 프로젝트의 주요 내용은 대용량 트래픽 처리, 동시성 제어, 검색 기능 최적화 입니다.
- 재고 소진에 어려움을 겪는 음식점 그리고, 음식을 저렴하게 구매하고 싶은 손님 양자 모두를 위한 '마감 할인 서비스'를 기획하였습니다.


<p align="center">  
  <img width="500" alt="last-bite" src="https://github.com/yungizzangzzang/Last-bite-BE/assets/115535910/6cb00d9c-2609-471e-ab23-fead3d41ce78">
</p>

### 📚 **사용 기술 스택**

- Nest.js, MySQL, nGrinder, Github Actions, Kubernetes, Redis, Prometheus, Grafana, ECS, EKS

---
### 1. 대용량 트래픽을 견딜 수 있는 유연한 서버 운영
<p align="center"> 
  <img width="500" alt="last-bite-architecture_ver3" src="https://github.com/yungizzangzzang/Last-bite-BE/assets/115535910/bf75d67f-c0db-4eca-ba92-9671fbca2fa4">
</p>  

- HPA(Horizontal Pod Autoscaler)를 도입하여 CPU 사용량에 기반한 자동 스케일링을 구현, 트래픽 변동에 유연하게 대응하여 항상 최적의 리소스 사용률을 유지.

- 실시간 모니터링을 통해 시스템의 건강 상태를 지속적으로 추적하고, 개발자가 부재중일 시 알람을 통해 빠른 대처가 가능하게 함.

### 2. 소켓 IO를 활용한 실시간 알림 기능
| 주문하기 | 알림보내기 |
|:-:|:-:|
| ![주문하기](https://github.com/yungizzangzzang/Last-bite-BE/assets/115535910/6722a917-1575-4228-b7aa-1892ffc7e04d) | ![알림보내기](https://github.com/yungizzangzzang/Last-bite-BE/assets/115535910/562c7ce0-5b4d-4dab-8455-329601fab981) |

### 3. Redis를 사용한 빠르고 정확한 예약 서비스.
<p align="center"> 
  <img width="500" alt="sequence_diagram ver 3 0" src="https://github.com/yungizzangzzang/Last-bite-BE/assets/115535910/41b664d6-8590-4985-a664-c90dc3fff847">
</p>

### 4. 현재 위치를 기반으로 한 음식점 조회 기능. 10가지 카테고리를 기반으로 원하는 종류의 가게를 가까운 순으로 조회

### 5. 가게의 핫딜 등록 및 예약 관리. 별도의 가게 관리 페이지에서 핫딜 상품의 수월한 등록 및 예약 관리를 지원.
<p align="center"> 
    <img width="500" alt="sequence_diagram ver 3 0" src="https://github.com/yungizzangzzang/Last-bite-BE/assets/115535910/0a2afba5-1c0f-4e93-8f58-5d3876a49c15">
</p>

---

# 🛠️ **해결하고자 했던 핵심 문제**

1. **대용량 트래픽을 견딜 수 있는 유연한 서버 운영**
    
    **1-1. Docker / Kubernetes**
    
    - **달성하고자 했던 목표**
    - 트래픽에 따라 Scale-out이 가능한 서버 구축
    - **실제 개선 사례**
        
      <p align="center"> 
        <img width="500" alt="sequence_diagram ver 3 0" src="https://github.com/yungizzangzzang/Last-bite-BE/assets/115535910/21ed0cdb-4209-4a39-9ba3-4df163cf0922">
      </p>
        
      - Scale-up, Scale-out을 할수록 높고, 안정적인 TPS와 적은 에러율을 확인할 수 있었습니다.
      - Vuser에 맞추어 Scale-up, Scale-out을 진행할 수 있었습니다.
        
2. **대용량 트래픽에 대한 동시성 제어**
    
    **2-1. Bull Queue**
    
    - **달성하고자 했던 목표**
    - 여러 컨테이너에서 들어오는 요청에 대한 작업 순서 정렬
    - **실제 개선 사례**
        
      <p align="center"> 
        <img width="500" alt="ver1 0 결과" src="https://github.com/yungizzangzzang/Last-bite-BE/assets/115535910/62c677e6-01aa-4c93-8732-7a5d0d105ddb">
      </p>
        
    
    **2-2. Redis streams**
    
    - **달성하고자 했던 목표**
    - 여러개의 컨슈머에서 Queue에 있는 작업을 순차적으로 처리
    - **실제 개선 사례**
        
      <p align="center"> 
        <img width="500" alt="ver2 0 결과" src="https://github.com/yungizzangzzang/Last-bite-BE/assets/115535910/e7c92e3f-d30e-4049-8583-8e831ef891d8">
      </p>      
      
      <p align="center"> 
        <img width="500" alt="ver2 0 sequence" src="https://github.com/yungizzangzzang/Last-bite-BE/assets/115535910/6cb0aa35-6ee9-4d70-ae6f-b15c402be6f6">
      </p>
        
    
3. **캐싱을 통한 성능 향상**
    
    **3-1. Redis**
    
    - **달성하고자 했던 목표**
    - 주문이 DB에 업데이트 되는 시간 개선
    - **실제 개선 사례**
        
      <p align="center"> 
        <img width="500" alt="ver3 0 결과" src="https://github.com/yungizzangzzang/Last-bite-BE/assets/115535910/8948d377-aac0-47eb-bab4-34cc24fe7c56">
      </p>        

      <p align="center"> 
        <img width="500" alt="ver3 0 sequence" src="https://github.com/yungizzangzzang/Last-bite-BE/assets/115535910/dd177094-0e04-426d-bc61-c8e61f064060">
      </p>

 4. **DB 조회 시간 개선**

    **4-1. 공간 인덱스 적용**
    
      <p align="center"> 
        <img width="500" alt="공간 인덱스 적용" src="https://github.com/yungizzangzzang/Last-bite-BE/assets/115535910/2b348595-2124-48d0-96cd-6169213524f0">
      </p>        

    **4-2. 단일 인덱스 적용**

      <p align="center"> 
        <img width="500" alt="단일 인덱스 적용" src="https://github.com/yungizzangzzang/Last-bite-BE/assets/115535910/06d67f7b-df39-4d1b-bd5e-7cfcd631e4a7">
      </p>   
      
    **4-3. 복합 인덱스 적용**

      <p align="center"> 
        <img width="500" alt="복합 인덱스 적용" src="https://github.com/yungizzangzzang/Last-bite-BE/assets/115535910/cb61c407-f5b2-41b3-921d-d0e4286c8a3c">
      </p> 

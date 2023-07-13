import "./style.css";
// import { api } from "./components/api/api";

  

/*    Test api  #1      */

// api.getCars(1, 5).then(carsData => {
//     console.log(carsData);
//   }).catch(error => {
//     console.error(error);
//   });

/*        Test api  #2      */

// async function getCarsData() {
//     try {
//       const carsData = await api.getCars(1, 5);
//       console.log(carsData); // Массив данных о машинах
//     } catch (error) {
//       console.error(error);
//     }
//   }      
//   getCarsData();
  

  
/*      Car run function     */

// const carIcon = <HTMLDivElement>document.querySelector('.car-icon');
// const endPosition = window.innerWidth - window.innerHeight * 0.25;
// let currentPosition = 0;

// function moveCar() {
//   if (currentPosition >= endPosition) {
//     clearInterval(intervalId);
//     return;
//   }

//   currentPosition += 5;
//   carIcon.style.transform = `translateX(${currentPosition}px)`;
// }

// const intervalId = setInterval(moveCar, 10);
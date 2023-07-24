import api from '../api/api';

const carBrands = ['Honda', 'Toyota', 'Ford', 'Chevrolet', 'Nissan', 'Volkswagen', 'BMW', 'Mercedes-Benz', 'Audi', 'Hyundai', 'Kia', 'Volvo', 'Mazda', 'Subaru', 'Lexus', 'Jeep', 'Chrysler', 'Dodge', 'Ram', 'GMC', 'Cadillac', 'Buick', 'Lincoln', 'Acura', 'Infiniti', 'Land Rover', 'Mitsubishi', 'Porsche', 'Jaguar', 'Ferrari', 'Lamborghini', 'Tesla', 'McLaren', 'Bugatti', 'Alfa Romeo', 'Genesis', 'Mini', 'Fiat', 'Smart', 'Suzuki', 'Peugeot', 'Renault', 'Citroën', 'Opel', 'Seat', 'Škoda', 'Dacia', 'Lada', 'Geely', 'Chery'];
const carModels = ['Accord', 'Camry', 'Mustang', 'Civic', 'Sentra', 'Golf', '3 Series', 'E-Class', 'A4', 'Sonata', 'Sportage', 'XC90', 'Mazda3', 'Impreza', 'RX', 'Grand Cherokee', '300', 'Challenger', '1500', 'Sierra', 'Escalade', 'Enclave', 'Navigator', 'TLX', 'Q50', 'Range Rover', 'Outlander', '911', 'F-Type', '488', 'Huracán', 'Model S', '720S', 'Chiron', 'Giulia', 'G70', 'Cooper', '500', 'ForTwo', 'Swift', '208', 'Clio', 'C4', 'Astra', 'Ibiza', 'Octavia', 'Duster', 'Granta', 'Emgrand', 'Tang'];

const getRandomColor = (): string => `#${Math.floor(Math.random() * 0x1000000).toString(16).padStart(6, '0')}`;

const getRandomNumber = (): number => Math.floor(Math.random() * 50);

const generate = async (): Promise<void> => {
  const promises = [];
  for (let i = 0; i < 100; i += 1) {
    promises.push(api.createCar(`${carBrands[getRandomNumber()]} ${carModels[getRandomNumber()]}`, getRandomColor()));
  }
  await Promise.all(promises);
};

export default generate;

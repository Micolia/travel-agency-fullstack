import { useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";

const TestAPI = () => {
  const { 
    login, register, token, getProfile, logout, 
    setTestOrganizer 
  } = useContext(UserContext);

  useEffect(() => {
    // 1️⃣ Test login
    const testLogin = async () => {
      console.log("Probando login...");
      await login("organizer@test.com", "123456"); // asegúrate de usar un usuario existente
    };

    // 2️⃣ Test registro
    const testRegister = async () => {
      console.log("Probando registro...");
      await register(`user${Date.now()}@test.com`, "123456", "Usuario Prueba", "traveler");
    };

    // 3️⃣ Test obtener perfil
    const testProfile = async () => {
      console.log("Obteniendo perfil...");
      await getProfile();
    };

    // 4️⃣ Test token temporal
    const testToken = () => {
      console.log("Seteando token de prueba...");
      setTestOrganizer();
    };

    // Ejecutar tests secuenciales
    const runTests = async () => {
      await testLogin();
      await testProfile();
      testToken();
      await testRegister();
    };

    runTests();
  }, []);

  // Botones de prueba rápidos
  return (
    <div>
      <h2>Test de API Backend</h2>
      <button onClick={getProfile}>Ver Perfil</button>
      <button onClick={logout}>Logout</button>
      <button onClick={setTestOrganizer}>Set Test Organizer</button>
    </div>
  );
};

export default TestAPI;

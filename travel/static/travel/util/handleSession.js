export default async function checkSessionStatus() {
    try {
        const response = await fetch('api/session');
        const data = await response.json();
        console.log(data.success);
        return data.success;
    } catch (error) {
        throw new Error('Error al verificar estado de sesión');
    }
}
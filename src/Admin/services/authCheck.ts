import { useAuth } from "./context/AuthContext";

export const IsAuthenticated = () => {
    const { login, user } = useAuth();
    console.log('u: ', user)
    if(user?.id) {
      return true;
    }else {
      return false;
    }
    // try {
    //   const response = await fetch(`${me}`, {
    //     method: 'GET',
    //     credentials: 'include',
    //     headers: {
    //       'Content-Type': 'application/json',
    //       // Add other headers as needed
    //     }
    //   });
  
    //   if (!response.ok) {
    //     throw new Error('Failed to fetch data');
    //   }
    //   const jsonData = await response.json();
    //   console.log('js: ', jsonData)
    //   // setData(jsonData);
    // } catch (error) {
    //   console.error('Error fetching data:', error);
    // }
  
  
  
    // try {
    //   const response = await axios.get(`${me}`, { withCredentials: true });
    //   if (response?.data && response?.data?.success) {
    //     // setUser(response?.data?.data);
    //     console.log('tr: ', true);
    //     return true;
    //   } else {
    //     console.log('tr: ', false);
  
    //     return false;
    //     // router.push("/login");
    //   }
    // } catch (error) {
    //   console.error('Error fetching data:', error);
    // }
  }
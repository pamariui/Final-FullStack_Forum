import React, { useEffect, useState } from 'react';
import Footer from '../../components/Footer';
import Main from '../../components/Main';
import Header from '../../components/Header/Header';


const MainPage = () => {
    const [username, setUsername] = useState('');
    useEffect(() => {
        const checkToken = async () => {
        const token = localStorage.getItem('token');

        if (token) {
            try {
            const response = await fetch('/api/v1/verify', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            setUsername(data.username);
            if (response.ok) {
            } else {
                throw new Error('User not authorized');
            }
            } catch (error) {
            console.error(error);
            localStorage.removeItem('token');
            window.location.href = '/login'; 
            }
        } else {
            window.location.href = '/login'; 
        }
        };

        checkToken();
    }, []);

  return (
    <>
        <Header
            username={username}
        />
        <Main>
            <div >
            <h1>{username} Welcome to the Forum</h1>
            {/* Add your Forum content here */}
            </div>
        </Main>
        <Footer copy={'Marius'} years={'2023 04'} color={'#666666'}/>
    </>
    
  );
}

export default MainPage;





const apiService = {
  postWithoutToken: async function (url: string, data: any): Promise<any> {
    return fetch(`${process.env.NEXT_PUBLIC_API_HOST}${url}`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }).then(async (response) => {
      if (!response.ok) {
        const err = await response.json()
        throw err
      }
      return response.json()
    })
  },
  postWithToken: async (url: string, data: any) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}${url}`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      if (res.status === 401) {
        // Session expired - redirect to login
        window.location.href = '/login';
        throw new Error('Session expired. Please log in again.');
      }
      const errData = await res.json();
      console.error('API Error Response:', errData); 
      throw new Error(errData.detail || errData.error || 'Unknown error');
    }

    return res.json();
  },

    getWithToken: async (url: string) => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}${url}`, {
      method: 'GET',
      credentials: 'include',
      });


      if (!res.ok) {
        if (res.status === 401) {
          // Session expired - redirect to login
          window.location.href = '/login';
          throw new Error('Session expired. Please log in again.');
        }
        const errData = await res.json();
        throw new Error(errData.detail || 'Unknown error');
      }


      return res.json();
    },
    patchWithToken: async (url: string, data: any) => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}${url}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        if (res.status === 401) {
          // Session expired - redirect to login
          window.location.href = '/login';
          throw new Error('Session expired. Please log in again.');
        }
        const errData = await res.json();
        throw new Error(errData.detail || 'Unknown error');
      }

      return res.json();
    },

    logout: async () => {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/users/auth/logout/`, {
          method: 'POST',
          credentials: 'include',
        });
      } catch (error) {
        console.error('Logout error:', error);
      }
      // Always redirect to login after logout
      window.location.href = '/login';
    },

    };
  

export default apiService
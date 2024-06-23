import axios from 'axios';

export const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;

// Универсальная функция POST
export async function post(url, data) {
  try {
    const accessToken = localStorage.getItem('accessToken');
    const response = await axios.post(baseUrl + url, data, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error during the API request', error);
    if (error.response && error.response.data) {
      // Бросаем ошибку с сообщением из ответа сервера
      throw new Error(error.response.data.message || "Unknown error occurred");
    } else {
      // Бросаем ошибку с общим сообщением, если в ответе нет тела
      throw new Error("Network error");
    }
  }
}


// Универсальная функция PUT 
export async function put(url, data) {
  try {
    const accessToken = localStorage.getItem('accessToken');
    const response = await axios.put(baseUrl + url, data, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    },);
    return response.data;
  } catch (error) {
    console.error('Error during the API request', error);
    if (error.response && error.response.data) {
      // Бросаем ошибку с сообщением из ответа сервера
      throw new Error(error.response.data.message || "Unknown error occurred");
    } else {
      // Бросаем ошибку с общим сообщением, если в ответе нет тела
      throw new Error("Network error");
    }
  }
}

// Универсальная функция GET
export async function get(url) {
  try {
    const accessToken = localStorage.getItem('accessToken');
    const response = await axios.get(baseUrl + url, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error during the API request', error);
    if (error.response && error.response.data) {
      // Бросаем ошибку с сообщением из ответа сервера
      throw new Error(error.response.data.message || "Unknown error occurred");
    } else {
      // Бросаем ошибку с общим сообщением, если в ответе нет тела
      throw new Error("Network error");
    }
  }
}

// Универсальная функция patch
export async function patch(url, data) {
  try {
    const accessToken = localStorage.getItem('accessToken');
    const response = await axios.patch(baseUrl + url, data, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error during the API request', error);
    if (error.response && error.response.data) {
      // Бросаем ошибку с сообщением из ответа сервера
      throw new Error(error.response.data.message || "Unknown error occurred");
    } else {
      // Бросаем ошибку с общим сообщением, если в ответе нет тела
      throw new Error("Network error");
    }
  }
}

// // Универсальная функция FETCH
// export async function fetch(url) {
//   try {
//     const accessToken = localStorage.getItem('accessToken');
//     const response = await axios.get(baseUrl + url, {
//       headers: {
//         'Authorization': `Bearer ${accessToken}`
//       }
//     });
//     return response.data;
//   } catch (error) {
//     console.error('Error during the GET request', error);
//     throw error;
//   }
// }

// Универсальная функция delete
export async function del(url, id) {
  try {
    const accessToken = localStorage.getItem('accessToken');
    const response = await axios.delete(baseUrl + url + '/' + id, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error during the API request', error);
    if (error.response && error.response.data) {
      // Бросаем ошибку с сообщением из ответа сервера
      throw new Error(error.response.data.message || "Unknown error occurred");
    } else {
      // Бросаем ошибку с общим сообщением, если в ответе нет тела
      throw new Error("Network error");
    }
  }
}

// Универсальная функция delete с телом запроса
export async function del_body(url, data) {
  try {
    const accessToken = localStorage.getItem('accessToken');
    const response = await axios.delete(baseUrl + url, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
      data: data
    });
    return response.data;
  } catch (error) {
    console.error('Error during the API request', error);
    if (error.response && error.response.data) {
      // Бросаем ошибку с сообщением из ответа сервера
      throw new Error(error.response.data.message || "Unknown error occurred");
    } else {
      // Бросаем ошибку с общим сообщением, если в ответе нет тела
      throw new Error("Network error");
    }
  }
}

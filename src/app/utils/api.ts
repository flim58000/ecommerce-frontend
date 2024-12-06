const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const fetchAPI = async (
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  body?: any,
  headers: Record<string, string> = {} 
) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers, // รวม Headers แบบไดนามิก
      },
      body: body ? JSON.stringify(body) : null,
    });

    if (!response.ok) {
      console.log("Response error:", response);
      return await response.json(); // คืนค่าข้อมูลแม้ response ไม่ OK
    }

    return await response.json();
  } catch (error) {
    console.error("API fetch error:", error);
    throw error;
  }
};
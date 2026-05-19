import APIRoutes from '../routes/APIRoutes';
import {ServerURL} from '../server/serverUrl';

// Insert My order
export const API_InsertSaleOrderSave = async (objlist,WhatsAppUrl, OwnerMobileNo) => {
    console.log('objlist', objlist);
    try {
      const response = await fetch(`${APIRoutes.INSERT_SALE_ORDER_SAVE}`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          objData: '',
          Whatsappaccountid: WhatsAppUrl,
          Ownerno: OwnerMobileNo
        
          
        },
        body: JSON.stringify(objlist)
  
        
      });      
      if (response.ok) {
        const data = await response.json();
        return data; 
      } else {
        console.error("Error checking existing user");
        return null;
      }
    } catch (error) {
      console.error('Failed to insert favorite product list:', error);
      throw error; // Re-throw so the calling function can handle it
    }
  };

  //Minimum order amount chek
  export const API_FetchMinimumOrderAmount = async () => {
    let objData = "";
    let objlist = {
        Comid: ServerURL.COMPANY_REF_ID,
    };
    try {
        const response = await fetch(`${APIRoutes.GET_MINIMUM_ORDER_AMOUNT}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                objData: objData,
            },
            body: JSON.stringify(objlist)
        });
        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }
        const data = await response.json();
        if (!data.data || !Array.isArray(data.data)) {
            throw new Error('No data found.');
        }
        return data;
    } catch (error) {
        console.error('Failed to fetch details:', error);
        throw error; // Re-throw so the calling function can handle it
    }
};


export const FetchCoupons = async (objlist) => {
  try {
    const response = await fetch(`${APIRoutes.GET_COUPONVALUE}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(objlist),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok.');
    }

    const data = await response.json();

    // Check if data is an array directly
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('No data found.');
    }

    return data; // Return the array directly
  } catch (error) {
    console.error('Failed to fetch details:', error);
    throw error; // Re-throw so the calling function can handle it
  }
};



export const Fetchsalecoupon = async (objlist) => {
  try {
    const response = await fetch(`${APIRoutes.GET_SALECOUPONVALUE}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(objlist),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok.');
    }

    const data = await response.json();
    return data; 
  } catch (error) {
    console.error('Failed to fetch details:', error);
    throw error; // Re-throw so the calling function can handle it
  }
};







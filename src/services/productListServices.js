import APIRoutes from '../routes/APIRoutes';
import {ServerURL} from '../server/serverUrl';

export const API_FetchProductByIndexPage = async () => {
    let objData = "";
    let objlist = {
        Comid: ServerURL.COMPANY_REF_ID,
    };
    try {
        const response = await fetch(`${APIRoutes.GET_PRODUCT_BY_INDEX_PAGE}`, {
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
        if (!data.data1 || !Array.isArray(data.data1)) {
            throw new Error('No data found.');
        }
        return data;
    } catch (error) {
        console.error('Failed to fetch details:', error);
        throw error; // Re-throw so the calling function can handle it
    }
};


export const API_FetchOfferFastMovingProduct = async () => {
    let objData = "";
    let objlist = {
        Comid: ServerURL.COMPANY_REF_ID,
    };
    try {
        const response = await fetch(`${APIRoutes.GET_OFFER_FAST_MOVING_PRODUCT}`, {
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
        if (!data || !Array.isArray(data)) {
            throw new Error('No data found.');
        }
        return data;
    } catch (error) {
        console.error('Failed to fetch details:', error);
        throw error; // Re-throw so the calling function can handle it
    }
};


export const API_FetchNewProduct = async () => {
    let objData = "";
    let objlist = {
        Comid: ServerURL.COMPANY_REF_ID,
    };
    try {
        const response = await fetch(`${APIRoutes.GET_NEW_PRODUCT}`, {
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
        if (!data || !Array.isArray(data)) {
            throw new Error('No data found.');
        }
        return data;
    } catch (error) {
        console.error('Failed to fetch details:', error);
        throw error; // Re-throw so the calling function can handle it
    }
};





export const API_FetchBrand = async () => {
   
    let objlist = {
        Comid: ServerURL.COMPANY_REF_ID,
    };
    try {
        const response = await fetch(`${APIRoutes.GET_NEW_BRAND}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
              
            },
            body: JSON.stringify(objlist)
        });
        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }
        const data = await response.json();
        if (!data || !Array.isArray(data)) {
            throw new Error('No data found.');
        }
        return data;
    } catch (error) {
        console.error('Failed to fetch details:', error);
        throw error; // Re-throw so the calling function can handle it
    }
};


export const API_FetchProductIdMoreItems = async (ProductId) => {
    let objlist = {
        Comid: ServerURL.COMPANY_REF_ID,
    };
    try {
        const response = await fetch(`${APIRoutes.GET_PRODUCT_ID_MORE_ITEMS}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                Id: ProductId,
            },
            body: JSON.stringify(objlist)
        });
        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }
        const data = await response.json();
        if (!data || !Array.isArray(data)) {
            throw new Error('No data found.');
        }
        return data;
    } catch (error) {
        console.error('Failed to fetch details:', error);
        throw error; // Re-throw so the calling function can handle it
    }
};



export const API_FetchProductByCategory = async (CategoryId, Multipleitems, Startindex, PageCount) => {
    let objlist = {
        Comid: ServerURL.COMPANY_REF_ID,
    };
    try {
        const response = await fetch(`${APIRoutes.GET_PRODUCT_BY_CATEGORY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                CId: CategoryId,
                Multipleitems: Multipleitems,
                Startindex: Startindex,
                PageCount: PageCount
            },
            body: JSON.stringify(objlist)
        });
        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }
        const data = await response.json();
        if (!data || !Array.isArray(data)) {
            throw new Error('No data found.');
        }
        return data;
    } catch (error) {
        console.error('Failed to fetch details:', error);
        throw error; // Re-throw so the calling function can handle it
    }
};


export const API_FetchProductBySubCategory = async (SubCategoryId, Multipleitems, Startindex, PageCount) => {
    let objlist = {
        Comid: ServerURL.COMPANY_REF_ID,
    };
    try {
        const response = await fetch(`${APIRoutes.GET_PRODUCT_BY_SUBCATEGORY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                SId: SubCategoryId,
                Multipleitems: Multipleitems,
                Startindex: Startindex,
                PageCount: PageCount
            },
            body: JSON.stringify(objlist)
        });
        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }
        const data = await response.json();
        if (!data || !Array.isArray(data)) {
            throw new Error('No data found.');
        }
        return data;
    } catch (error) {
        console.error('Failed to fetch details:', error);
        throw error; // Re-throw so the calling function can handle it
    }
};


export const API_FetchProductById = async (ProductId) => {
    let objlist = {
        Comid: ServerURL.COMPANY_REF_ID,
    };
    try {
        const response = await fetch(`${APIRoutes.GET_PRODUCT_BY_ID}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                Id: ProductId,                
            },
            body: JSON.stringify(objlist)
        });
        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }
        const data = await response.json();
        if (!data || !Array.isArray(data)) {
            throw new Error('No data found.');
        }
        return data;
    } catch (error) {
        console.error('Failed to fetch details:', error);
        throw error; // Re-throw so the calling function can handle it
    }
};

//Search products
export const API_SearchByProduct = async (keyword) => {
    let Description = "Description";
    let objlist = {
        Comid: ServerURL.COMPANY_REF_ID,
    };
    try {
        const response = await fetch(`${APIRoutes.GET_SEARCH_BY_PRODUCT}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                Keyword: keyword,
                Column: Description,              
            },
            body: JSON.stringify(objlist)
        });
        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }
        const data = await response.json();
        if (!data || !Array.isArray(data)) {
            throw new Error('No data found.');
        }
        return data;
    } catch (error) {
        console.error('Failed to fetch details:', error);
        throw error; // Re-throw so the calling function can handle it
    }
};
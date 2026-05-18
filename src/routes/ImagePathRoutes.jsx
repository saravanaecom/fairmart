import ServerURL from "../server/serverUrl";

export const ImagePathRoutes = {
    CategoryImagePath: ServerURL.PRODUCTION_HOST_URL +`categoryimages/`, 
    BannerOfferPostImagePath: ServerURL.PRODUCTION_HOST_URL,  
    ProductImagePath: ServerURL.PRODUCTION_HOST_URL + ``, 
    SubCategoryImagePath: ServerURL.PRODUCTION_HOST_URL,  
    ProductDetailsImagePath: ServerURL.PRODUCTION_HOST_URL +`/productimages/`, 
};


// eslint-disable-next-line import/no-anonymous-default-export
export default ImagePathRoutes ;

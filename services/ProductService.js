class ProductService{
    constructor(db){
        this.sequelize=db.sequelize
        this.product=db.Product
        this.user=db.User
        this.brand=db.Brand
        this.category=db.Category
    }
    async getProducts(){
       const query=`SELECT 
       Products.id,Products.name,Products.price,Products.description,Products.deleted,Products.imageUrl,Products.quantity,  
       Categories.name AS categoryName, 
       Brands.name AS brandName
   FROM 
       products
   JOIN 
       Categories ON products.categoryId = categories.id
   JOIN 
       Brands ON products.brandId = brands.id;`

       try{
        const[results,metadata]=await this.sequelize.query(query)
        console.log(results)
        return results
       }catch(error){
         throw new Error (error)
       }
    }

    async addProduct(name,price,description,imageUrl,quantity,brandId,categoryId){
        const productBrandId=await this.brand.findOne({
            where:{id:brandId}
        })
        if(productBrandId==null){
            throw new Error("Brand does not exist, create a brand first")
        }
        const productCategoryId=await this.category.findOne({
            where:{id:categoryId}
        })
        if(productCategoryId==null){
            throw new Error("Category does not exist, create a category first")
        }
        const existingProduct=await this.product.findOne({
            where:{
                name:name
            }
        })
        if(existingProduct){
            throw new Error("Product already exists")
        }
        return await this.product.create({
            name:name,
            price:price,
            description:description,
            imageUrl:imageUrl,
            quantity:quantity,
            brandId:brandId,
            categoryId:categoryId
        })
    }

    async updateProduct(name,price,description,imageUrl,quantity,brandId,categoryId,id){
        const existingProduct=await this.product.findOne({
            where:{
                id:id
            }
        })
        if(!existingProduct){
            throw new Error("Product not exists")
        }
        const productBrandId=await this.brand.findOne({
            where:{id:brandId}
        })
        if(productBrandId==null){
            throw new Error("Brand does not exist, create a brand first")
        }
        const productCategoryId=await this.category.findOne({
            where:{id:categoryId}
        })
        if(productCategoryId==null){
            throw new Error("Category does not exist, create a category first")
        }
        return await this.product.update({
            name:name,
            price:price,
            description:description,
            imageUrl:imageUrl,
            quantity:quantity,
            brandId:brandId,
            categoryId:categoryId
        },   
            {where:{id:id}}
               
        )}

    async deleteProduct(id){
            const product=await this.product.findOne({
                where:{
                    id:id
                }
            })
            if(!product){
                throw new Error("product not found")
            }
            product.deleted=true
            await product.save()
            return product
        }

        //only for testing purpose
    async deleteTest(id){
        const product=await this.product.destroy({where:{id:id}})
        return product
    }
        
    async reactive(id) {
            const product = await this.product.findOne({
                where: {
                    id: id
                }
            });
        
            if (!product) {
                throw new Error("Product not found");
            } else if (product.deleted === false) {
                throw new Error("Product is not deleted");
            } else {
                product.deleted = false;
                await product.save();
                return product;
            }
        }
        
    async search(name){
         const query=`SELECT 
         Products.name,Products.price,Products.description,Products.imageUrl,Products.quantity,  
         Categories.name AS categoryName, 
         Brands.name AS brandName
     FROM 
         products
     JOIN 
         Categories ON Products.categoryId = categories.id
     JOIN 
         Brands ON Products.brandId = brands.id
     WHERE 
         Products.name LIKE '%${name}%'         
         `
        const[results,metadata]=await this.sequelize.query(query)
        return results
    }
}

module.exports=ProductService
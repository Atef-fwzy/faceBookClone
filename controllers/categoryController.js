const {category,validationCreateCategory} = require("../model/category");
const{user} = require("../model/users")


const createCategory = async(req,res)=>{
    const {error} = validationCreateCategory(req.body)
    if(error)
         return   res.status(400).json({message:error})
const token = req.headers.authorization.split(" ")[1] ||req.headers.Authorization.split(" ")[1] ;
 const currenUser =await user.find({"token":token});

    const data =await  category.create({
        title : req.body.title,
        user : currenUser[0]._id
        
    })
    await data.save();
     res.status(200).json({status:200, message: "category has been  created  successfully ." ,data})

}
const getAllCategories = async(req,res)=>{
    const  categories = await category.find();
     res.status(200).json({staatus:"successfully", message: "all Categories ." ,data:categories})

}

const deleteCategory = async(req,res)=>{
    const id = req.params.id;
    if(!id)
      return res.status(401).json({status:401, message: "category not found , anter valide id ."})
         
    const deleteCategory = await category.findByIdAndDelete(id)
        if(!deleteCategory)
      return res.status(401).json({status:401, message: "category not found , anter valide id ."})
     res.status(200).json({status:200, message: "category has been  Deleted   successfully ." ,deleteCategory})

}

module.exports = {
     createCategory,
     getAllCategories,
     deleteCategory
}
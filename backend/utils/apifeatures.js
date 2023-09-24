class ApiFeatures {
    constructor(query,queryStr){
        this.query=query;
        this.queryStr=queryStr;
    }

    search(){
        const keyword=this.queryStr.keyword?{
            title:{
                $regex:this.queryStr.keyword,
                $options: "i",
            },
        }:
        {};

        this.query=this.query.find({...keyword});
        return this;
    }

    filter(){
        const queryCopy={...this.queryStr};
        const querySort={...this.queryStr.sort};
        
        //removing some fields for category
        const removeFields=["keyword","page","limit","sort"];
        removeFields.forEach(key=> delete queryCopy[key]);
        
        //filter for price and rating
        let queryStr=JSON.stringify(queryCopy);
        queryStr=queryStr.replace(/\b(gt|gte|lt|lte)\b/g,key => `$${key}`);
        
        this.query= this.query.find(JSON.parse(queryStr)).sort(querySort);
        return this;
    }

    pagination(resultPerPage){
        const currentPage=Number(this.queryStr.page) || 1;
        const skip= (currentPage-1)*resultPerPage;

        this.query=this.query.limit(resultPerPage).skip(skip);

        return this;
    }
};

module.exports=ApiFeatures;
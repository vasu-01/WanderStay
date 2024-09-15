const Listing=require("../models/listing");

module.exports.index=async (req,res)=>{
    const allListings= await Listing.find({});
    res.render("listings/index.ejs",{allListings});
  };

module.exports.renderNewForm=(req,res)=>{
    res.render("listings/new.ejs");
}

module.exports.showListing=async (req,res)=>{
    let {id} = req.params;
    const listing= await Listing.findById(id).populate({path:"reviews", populate:{path:"author"}}).populate("owner");
    // console.log(listing.imgl);
    if(!listing){
      req.flash("error","Your requested listing not exists");
      res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
}

module.exports.createListing = async(req,res)=>{
    //let{title,description,image,price,country,location}=req.body; 
    //but this format can be lengthy so we use another method in which we make 
    //new.ejs data variables to listing object like listing[title] ,here title in now a keyword
    let url=req.file.path;
    let filename=req.file.filename;
    const newlisting=new Listing(req.body.listing);
    newlisting.owner=req.user._id;
    newlisting.image={url,filename};
    await newlisting.save();
    req.flash("success","New Listing created successfully!");
    res.redirect("/listings");
}

module.exports.editListings = async (req,res)=>{
    let {id}=req.params;
    const listing= await Listing.findById(id);
    // console.log(listing);
    if(!listing){
      req.flash("error","Your requested listing not exists");
      res.redirect("/listings");
    }
    //this two lines used for decreasing the image quality to show on edit page bcoz there is no need to show high quality picture
    let originalImageUrl=listing.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/h_100,w_150");
    res.render("listings/edit.ejs",{listing,originalImageUrl});
  
}
module.exports.updateListings= async (req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});

    if(typeof req.file!=="undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        listing.image={url,filename};
        await listing.save();
    }
    req.flash("success","Listing updated successfully!");
    res.redirect(`/listings/${id}`);
}

module.exports.deleteListings = async(req,res)=>{
    let {id}=req.params;
    let deleteListing=await Listing.findByIdAndDelete(id);
    req.flash("success","Listing deleted successfully!");
    res.redirect("/listings");
}
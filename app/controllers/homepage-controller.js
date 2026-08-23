const homepageController ={
    homepage(req,res){
        res.render('homepage',{title: 'Accueil'})
    }
}
export default homepageController;
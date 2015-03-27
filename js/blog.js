$(function() {
 
    Parse.$ = jQuery;
 
    // Replace this line with the one on your Quickstart Guide Page
	Parse.initialize("ya95rgcODDH5xjoBWYGSP2DO07RK3H9tdRhDWvTw", "GK667xY34sQsIbclDua3od7mMGj2cgrAoIQ7OAMK"); 
	

	var Blog = Parse.Object.extend("Blog");
	var Blogs = Parse.Collection.extend({
    model: Blog
	});
	
	var BlogsView =  Parse.View.extend({
    template: Handlebars.compile($('#blogs-tpl').html()),
    render: function(){ 
        var collection = { blog: this.collection.toJSON() };
        this.$el.html(this.template(collection));
    }
});
	
	var blogs = new Blogs();
	
	blogs.fetch({
    success: function(blogs) {
    var blogsView = new BlogsView({ collection: blogs });
    blogsView.render();
    $('.main-container').html(blogsView.el);
},
    error: function(blogs, error) {
        console.log(error);
    }
}); 

});

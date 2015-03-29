$(function() {
 
    Parse.$ = jQuery;
 
    // Replace this line with the one on your Quickstart Guide Page
	Parse.initialize("ya95rgcODDH5xjoBWYGSP2DO07RK3H9tdRhDWvTw", "GK667xY34sQsIbclDua3od7mMGj2cgrAoIQ7OAMK"); 
	
	$('.form-signin').on('submit', function(e) {
 
    // Prevent Default Submit Event
    e.preventDefault();
 
    // Get data from the form and put them into variables
    var data = $(this).serializeArray(),
        username = data[0].value,
        password = data[1].value;
 
    // Call Parse Login function with those variables
    Parse.User.logIn(username, password, {
        // If the username and password matches
        success: function(user) {
            alert('Welcome!');
        },
        // If there is an error
        error: function(user, error) {
            console.log(error);
        }
    });
 
});
var LoginView = Parse.View.extend({
    template: Handlebars.compile($('#login-tpl').html()),
    events: {
        'submit .form-signin': 'login'
    },
    login: function(e) {
 
        // Prevent Default Submit Event
        e.preventDefault();
 
        // Get data from the form and put them into variables
        var data = $(e.target).serializeArray(),
            username = data[0].value,
            password = data[1].value;
 
        // Call Parse Login function with those variables
        Parse.User.logIn(username, password, {
            // If the username and password matches
            success: function(user) {
    var welcomeView = new WelcomeView({ model: user });
    welcomeView.render();
    $('.main-container').html(welcomeView.el);
},
            // If there is an error
            error: function(user, error) {
                console.log(error);
            }
        });
    },
        render: function(){
        this.$el.html(this.template());
    }
}),
    WelcomeView = Parse.View.extend({
        template: Handlebars.compile($('#welcome-tpl').html()),
        render: function(){
            var attributes = this.model.toJSON();
            this.$el.html(this.template(attributes));
        }
    });
	
	var loginView = new LoginView();
loginView.render();
$('.main-container').html(loginView.el);

});

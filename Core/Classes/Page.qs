@nested
@__compile: function(method, obj){
    console.log('ti pidor');
}
@ns: UI
define UIComponent Page
  public String title
  public Variant dataContext
  public Function next
  public Function back
@nested
@__afterCompile: function(source, name){
    source.push('var instance = new '+ name +'();');
    source.push('instance.load()');
    return source;
}
@description: Page UI component. Fills the whole window
@ns: UI
define UIComponent Page
  public String title
  public Variant dataContext
  public Function next
  public Function back
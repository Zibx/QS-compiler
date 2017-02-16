@description: Array class (primitive)
@unknownProperty:
  @argument key: Number
  @argument val: Variant
  set: function(key, val){
    if(typeof key !== 'Number')
      throw new Error('Invalid index');

    return that[key] = val;
  }
  get: function(key){
    return that[key];
  }
define Class Array
  public Function push: (val) -> return that.push(val)
  public Function pop: (val) -> return that.pop(val)


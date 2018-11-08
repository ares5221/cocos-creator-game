cc.Class {
    extends: cc.Component

    properties: {
        # foo:
        #   default: null
        #   type: cc
        #   serializable: true # [optional], default is true
        #   visible: true      # [optional], default is true
        #   displayName: 'Foo' # [optional], default is property name
        #   readonly: false    # [optional], default is false
        heronode:
            default:null
            type:cc.Node
    }
    
    idle:() ->
        
        #this.heronode.getComponent("global")?.idle()

    update: (dt) ->
        # do your update here
}

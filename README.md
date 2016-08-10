# Jquery-Ajax-Wrapper
A javascript wrapper that let you manage multiple jquery ajax call and process the response, before the response is processed by the event initiator

## This ajax wrapper gives you the ability to perform basic jquery ajax processes while maintaining a high level of control on all request and responses that is sent and recieve.

#### The reponses can be intercepted before reaching it destination

### Basic Usage

  $.shypesjax({  
      caller: 'appcaller',  
      application: 'project',  
      data:{task:'deleteUser',user:10},  
      success: function (response){console.log(response)},  
      error:function(xhr, status){ }  
  });  

describe("Servers test (with setup and tear-down)", function() {
  beforeEach(function () {
    // initialization logic
    serverNameInput.value = 'Alice';
  });

  it('should add a new server to allServers on submitServerInfo()', function () {
    submitServerInfo();

    expect(Object.keys(allServers).length).toEqual(1);
    expect(allServers['server' + serverId].serverName).toEqual('Alice');


  });

  it(`create table row element for serverTbody that contains the server's name`, function(){
    submitServerInfo();
    let row = document.querySelectorAll('#server1 td');
    let x = row[0].innerText;
    let y = row[1].innerText;
    expect(x).toEqual('Alice');
    expect(y).toEqual('$0.00');

  })




  afterEach(function() {
    serverId = 0;
    allServers = {};
    serverTbody.innerHTML = '';
    
  });
});

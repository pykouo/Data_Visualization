$(function() {
  var bar = c3.generate({
    bindto: '.bar',
    data: {
      columns: [
        ['data1', 30, 200, 100, 400, 150, 250],
        ['data2', 130, 100, 140, 200, 150, 50]
      ],
      type: 'bar'
    }
  });
  var line = c3.generate({
    bindto: '.line',
    data: {
      columns: [
        ['data1', 30, 200, 100, 400, 150, 250],
        ['data2', 130, 100, 140, 200, 150, 50]
      ],
      type: 'line'
    }
  });
  var area = c3.generate({
    bindto: '.area',
    data: {
      columns: [
        ['data1', 30, 200, 100, 400, 150, 250],
        ['data2', 130, 100, 140, 200, 150, 50]
      ],
      type: 'area'
    }
  });
  var pie = c3.generate({
    bindto: '.pie',
    data: {
      columns: [
        ['data1', 30, 200, 100, 400, 150, 250],
        ['data2', 130, 100, 140, 200, 150, 50]
      ],
      type: 'pie'
    }
  });
  var scatter = c3.generate({
    bindto: '.scatter',
    data: {
      columns: [
        ['data1', 30, 200, 100, 400, 150, 250],
        ['data2', 130, 100, 140, 200, 150, 50]
      ],
      type: 'scatter'
    }
  });
  var boxNum = $('.chart_box .box').size();
  console.log(boxNum);

  $('.add-element').draggable({
    helper: function() {
      return $(this).clone().removeClass("add-element").appendTo('.chart_box').show();
    },
    cursor: "move",
    containment: ".chart_box"
  });
  $('.chart_box').droppable({
    accept: ".add-element",
    drop: function(event, ui) {
      if (!ui.draggable.hasClass("dropped")) {
        var chart_type = $(ui.draggable).clone().removeClass("ui-draggable").removeClass("dropped").removeClass("add-element").removeClass("c3").attr('class');
        var num = $('.chart_box').find('.box').size(); //以後要從資料庫讀
        createChart(num, chart_type);
      }
    }
  }).sortable({
    cursor: "move",
    helper: function(evt, ui) {
      return $(ui).clone().appendTo('.chart_box').show();
    },
    placeholder: "ui-sortable-placeholder",
    start: function(event, ui) {
      var size = ui.item.attr("class").substr(4);
      $(".ui-sortable-placeholder").addClass(size);
    },
    sort: function(event, ui) {
      $(".ui-sortable-placeholder").css('width', ui.item.width()-50 + 'px');
      $(".ui-sortable-placeholder").css('height', ui.item.height() + 'px');
    },
    stop: function(event, ui) {
      console.log($(".ui-sortable-placeholder").width());

    }
  });
  $('.chart_box .box').disableSelection();
});

function createChart(num, type) {
  //先新增出box
  $('.chart_box').append(chartbox(num, type));
  //新增chart
  addchart(num, type);
}

function chartbox(num, type) {
  return '<div class="box box-1" data-type="' + type + '"><div class="more"><span class="circle"></span><span class="circle"></span><span class="circle"></span><div class="menu"><div class="edit">edit</div><div class="delete">delete</div><div class="detail">detail</div></div></div><div class="title">TestBox</div><div class="chart"><div id="chart_' + num + '"></div></div></div>'
}

var charts = new Array(); //store chart object
function addchart(num, newtype) {
  $('.chart_box').find('#chart_' + num).append('Some text');
  console.log(newtype);
  switch (newtype) {
    case "pie":
      addPie(num);
      break;
    default:
      addOther(num, newtype);
      break;
  }
}

function changechart(num, type, source) {
  if (source == '') {
    charts[num].transform(type);
  } else {
    // console.log(source);
    // charts[num].unload();
    // charts[num].load({
    //     url: source,
    //     mimeType: 'json',
    //     type: type
    // });
    if (type != 'line') {
      d3.json(source, function(error, json) {
        if (error) return console.warn(error);
        var data = {};
        var name = [];
        json.forEach(function(e) {
          name.push(e.name);
          data[e.name] = e.value;
        });
        chart = c3.generate({
          bindto: '#chart_' + num,
          data: {
            json: [data],
            keys: {
              value: name,
            },
            type: type
          },
        });
        charts[num] = chart;
      });
    } else {
      d3.json(source, function(error, json) {
        var nestedData = d3.nest().key(function(d) {
          return d.time;
        }).entries(json);
        var names = d3.set();
        var formattedData = nestedData.map(function(entry) {
          var values = entry.values;
          var obj = {};
          values.forEach(function(value) {
            obj[value.name] = value.value;
            names.add(value.name);
          })
          obj.time = entry.key;
          return obj;
        });

        var chart = c3.generate({
            bindto: '#chart_' + num,
          data: {
            json: formattedData,
            keys: {
              x: 'time', // it's possible to specify 'x' when category axis
              value: names.values(),
            }
          },
          axis: {
            x: {
              type: 'timeseries',
              tick: {
                format: '%Y-%m-%d'
              }
            }
          },
          type: 'line'
        });

        charts[num] = chart;
      });

    }

  }

}

function addPie(num) {
  d3.json('https://raw.githubusercontent.com/pykouo/Day7/master/pie1.json', function(error, json) {
    if (error) return console.warn(error);
    var data = {};
    var name = [];
    json.forEach(function(e) {
      name.push(e.name);
      data[e.name] = e.value;
    });
    chart = c3.generate({
      bindto: '#chart_' + num,
      data: {
        json: [data],
        keys: {
          value: name,
        },
        type: 'pie'
      },
    });
    charts.push(chart);
  });
}

function addOther(num, newtype) {
  d3.json('https://raw.githubusercontent.com/pykouo/Day7/master/data3.json', function(error, json) {
    chart = c3.generate({
      bindto: '#chart_' + num,
      data: {
        json: json,
        type: newtype
      },
    });
    charts.push(chart);
  });
}
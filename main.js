var width = 960,
	height = 500;
var projection = d3.geoNaturalEarth1();
var path = d3.geoPath().projection(projection);
var graticule = d3.geoGraticule();
var svg
var qs=window.location.search
var qs_dict=parse_qs()

// var zoom = d3.behavior.zoom()
//     .scaleExtent([1, 20])
//     .on("zoom", zoomed);

async function init(){
  setup_map()
  //load_map()
  //qs=window.location.search
  //if (qs=="") qs="?"
  test_url="get-city-info?"+qs
  city_info=await read_json_async(test_url)
  console.log(test_url)
  console.log(city_info)

  country_raw_data1=await read_json_async("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")
  country_data1=country_raw_data1.features
  city_data_raw1=[]
  coords=city_info.coordinates
  if (coords!=null){
    city_item={}
    city_item["longitude"]=coords[0]
    city_item["latitude"]=coords[1]
    city_item["r"]=20
    city_item["img"]="assets/img/icons/star.png"
    city_data_raw1.push(city_item)
  }
    d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson", function(error1, data1) {
    if (error1) throw error1;
    country_data1=data1.features
    render(country_data1,city_data_raw1)

    })

  //draw_countries(svg,countries)
  
  //console.log(countries)
  //show_id_hide_class("add-business-step1","business_form_steps")
  //fill_select("location_0-country" ,country_option_list0)
  if ($$("product_0-hs2")!=null) {
      hs_option_list0=await read_json_async("get-hs-options?"+qs)
      console.log(hs_option_list0)
      fill_select("product_0-hs2" ,hs_option_list0)
  } 

  if ($$("location_0-country")!=null) {
      country_option_list0=await read_json_async("get-countries?"+qs)
      console.log(country_option_list0)
      fill_select("location_0-country" ,country_option_list0)
      // hs_option_list0=await read_json_async("get-hs-options?"+qs)
      // console.log(hs_option_list0)
      // fill_select("product_0-hs2" ,hs_option_list0)
  } 

  
  //$("#location_0-country").trigger("chosen:updated");
  //$("#product_0-hs2").trigger("chosen:updated");

  //$("#location_0-country").chosen();
  //show_id_hide_class("hero-company-title-label","content_item")

}

async function on_country_select(obj1){
  //qs=window.location.search
  console.log(obj1)
  country_select_id=obj1.id
  if (country_select_id==null) return
  country_val=obj1.value
  //console.log("country_val",country_val)
  if (country_val==null) return
  if (len(country_val)<2) return
  if (qs=="") province_url="get-provinces?country="+country_val
  else province_url="get-provinces?"+qs+"&country="+country_val
  //console.log(province_url)
  option_list0=await read_json_async(province_url)
  province_select_id=country_select_id.replace("country","province")
  //console.log(province_select_id)
  //console.log(option_list0)
  
  fill_select(province_select_id ,option_list0)
  //$("#"+province_select_id).trigger("chosen:updated");

}


async function on_province_select(obj1){
  //qs=window.location.search
  //console.log(obj1)
  province_select_id=obj1.id
  if (province_select_id==null) return
  province_val=obj1.value
  if (province_val==null) return
  if (len(province_val)<2) return

  if (qs=="") city_url="get-cities?province="+province_val
  else city_url="get-cities?"+qs+"&province="+province_val
  option_list0=await read_json_async(city_url)
  city_select_id=province_select_id.replace("province","city")

  fill_select(city_select_id ,option_list0)
  //$("#"+city_select_id).trigger("chosen:updated");

}

//onchange="on_hs2_select(this)"
async function on_hs2_select(obj1){
  console.log(obj1)
  hs2_select_id=obj1.id
  if (hs2_select_id==null) return
  hs2_val=obj1.value
  if (qs=="") hs4_url="get-hs-options?hs="+hs2_val
  else hs4_url="get-hs-options?"+qs+"&hs="+hs2_val
  console.log(hs4_url)
  option_list0=await read_json_async(hs4_url)
  console.log("on_hs2_select - option_list0",option_list0)
  hs4_select_id=hs2_select_id.replace("hs2","hs4")
  fill_select(hs4_select_id ,option_list0)
  //$("#"+hs4_select_id).trigger("chosen:updated");
}

async function on_hs4_select(obj1){
  console.log(obj1)
  hs4_select_id=obj1.id
  if (hs4_select_id==null) return
  hs4_val=obj1.value
  if (qs=="") hs6_url="get-hs-options?hs="+hs4_val
  else hs6_url="get-hs-options?"+qs+"&hs="+hs4_val
  console.log(hs6_url)
  option_list0=await read_json_async(hs6_url)
  hs6_select_id=hs4_select_id.replace("hs4","hs6")
  fill_select(hs6_select_id ,option_list0)
  //$("#"+hs6_select_id).trigger("chosen:updated");
}


function setup_map(){
  if ($$("map-svg")==null){
  svg = d3.select("#map").append("svg")
  .attr("width", width)
  .attr("height", height);    
  }
  else {
  svg = d3.select("#map-svg")
  .attr("width", width)
  .attr("height", height);    
  }
}

function load_map(){
  d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson", function(error1, data1) {
    if (error1) throw error1;
    country_data1=data1.features
    d3.csv("https://raw.githubusercontent.com/curran/data/gh-pages/geonames/cities100000.csv", function(error2,data2){
      city_data1=data2
      console.log("city_data1", city_data1)
      render(country_data1,city_data1)
    })
  })  
}


function draw_countries(svg_obj,country_feature_list,onclick=null,onmouseover=null,onmouseout=null){
  svg_obj.append("g")
      .selectAll("path")
      .data(country_feature_list)
      .enter().append("path")
      .attr("fill", function(d0){
        //console.log(d0)
        if (d0.color!=null) return d0.color
        return "pink"
      })
      .attr("d", d3.geoPath()
          .projection(projection)
      )
      .style("stroke", "blue")  
      .on("click", function(d0){
        if (onclick==null) console.log(d0.id)
        else onclick(d0)        
      })            
      .on("mouseover", function(d0){
        if (onmouseover==null) {} //console.log(d0.id)
        else onmouseover(d0)        
      })            
      .on("mouseout", function(d0){
        if (onmouseout==null) {} //console.log(d0.id)
        else onmouseout(d0)        
      })            

  return svg_obj
}

function draw_city_img(svg_obj,city_feature_list,onclick=null,onmouseover=null,onmouseout=null){
  img_size=20
  var imgs = svg_obj.selectAll("image").data(city_feature_list);
            imgs.enter()
            .append("svg:image")        
            .attr("x", function (d){ return projection([d["longitude"],d["latitude"]])[0]-img_size*0.5;})
            .attr("y", function (d){ 
              //console.log("image:",d)
              return projection([d["longitude"],d["latitude"]])[1]-img_size*0.5;})      
          //.attr("r",  2) //.attr("r",  function (d){ return rScale(d[rColumn]); })         
             .attr('width', img_size)
            .attr('height', img_size)
            .attr("xlink:href",function(d0){
              if (d0["img"]!=null) return d0["img"]
              return "assets/img/icons/plant.png"
            })
            .on("click", function(d0){
              if (onclick==null) console.log(d0.name)
              else onclick(d0)        
            })     
            .on("mouseover", function(d0){
              if (onmouseover==null) {} //console.log(d0.id)
              else onmouseover(d0)        
            })            
            .on("mouseout", function(d0){
              if (onmouseout==null) {} //console.log(d0.id)
              else onmouseout(d0)        
            })            


  return svg_obj          
}


function draw_city_circles(svg_obj,city_feature_list,onclick=null,onmouseover=null,onmouseout=null){
  var circles = svg_obj.selectAll("circle").data(city_feature_list);
  circles.enter().append("svg:circle")
      .attr("cx", function (d){ 
        proj0=projection([d["longitude"],d["latitude"]])[0]
        return proj0//projection([d[xColumn],d[yColumn]])[0]; 
      })
      .attr("cy", function (d){ 
        //console.log(d)
        proj0=projection([d["longitude"],d["latitude"]])[1]
        return proj0//projection([d[xColumn],d[yColumn]])[1]; 
      })      
      .attr("fill", function(d){
        //console.log(d0)
        if (d.color!=null) return d.color
        return "green"
      })
      .attr("r",  function (d){
        if (d.r!=null) return d.r
        return 2 //0.0000005*d["population"]
      }) //.attr("r",  function (d){ return rScale(d[rColumn]); })
      .on("click", function(d0){
        if (onclick==null) console.log(d0.name)
        else onclick(d0)
      })            
      .on("mouseover", function(d0){
        if (onmouseover==null) {} //console.log(d0.id)
        else onmouseover(d0)        
      })            
      .on("mouseout", function(d0){
        if (onmouseout==null) {} //console.log(d0.id)
        else onmouseout(d0)        
      })            

      // .on("mouseover", tip.show)
      // .on("mouseout", tip.hide);      
    circles.exit().remove();
  return svg_obj
}

function render(country_data0,city_data0){
  country_features=[]
  city_features=[]
  for (i0 in country_data0){
    item0=country_data0[i0]
    country_features.push(item0)
  }
  for (i0 in city_data0){
    item0=city_data0[i0]
    if (item0.longitude==null) continue
    if (i0>50) continue
    //item0["r"]=0.0000005*item0["population"]  
    //item0["img"]= "assets/img/diamond.png"
    //if (item0["name"]!=null && item0["name"][0].toLowerCase()=="k") item0["img"]= "assets/img/icons/oil.png" //item0["color"]="red"
    //if (item0["name"]!=null && item0["name"][0].toLowerCase()=="c") item0["color"]="orange"  
    //console.log(item0)
    // if (item0.id=="ZAF") item0["color"]="blue"
    // else if (item0.id=="EGY") item0["color"]="green"  
    //else item0["color"]="#69b3a2"
    city_features.push(item0)
  }  
    svg=draw_countries(svg,country_features)
    svg=draw_city_img(svg,city_features)
    //svg=draw_city_circles(svg,city_features)
 

}


function type(d){
  d.latitude = +d.latitude;
  d.longitude = +d.longitude;
  d.population = +d.population;
  return d;
}

function add_block(block_id,block_class){ //assuming the block is like location_0, product_0, service_0, block class is the class assigned to the block
  new_block_name=block_id.split("_")[0]
  n_classes=len($("."+block_class))
  new_block_id=new_block_name+"_"+n_classes
  block_el=$$(block_id)
  block_el_parent=block_el.parentElement
  block_el_outer_html=block_el.outerHTML
  new_block_el_outer_html=replace_all(block_el_outer_html,block_id,new_block_id)

  new_block_el=create_el_basic("div",block_el_parent)
  new_block_el.outerHTML=new_block_el_outer_html

  //block_el_parent.innerHTML+=new_block_el_outer_html
}


function add_block2(block_id,block_class){ //assuming the block is like location_0, product_0, service_0, block class is the class assigned to the block
  new_block_name=block_id.split("_")[0]
  n_classes=len($("."+block_class))
  new_block_id=new_block_name+"_"+n_classes
  el0=$("#"+block_id)
  parent0=el0.parent()
  el0.clone().appendTo(parent0);
  // block_el=$$(block_id)
  // block_el_parent=block_el.parentElement
  // block_el_outer_html=block_el.outerHTML
  // new_block_el_outer_html=replace_all(block_el_outer_html,block_id,new_block_id)

  // new_block_el=create_el_basic("div",block_el_parent)
  // new_block_el.outerHTML=new_block_el_outer_html

  //block_el_parent.innerHTML+=new_block_el_outer_html
}
// function replace_all(text,a,b){
//   text_split=text.split(a)
//   new_text=text_split.join(b)
//   return new_text
// }

// async function submit_business_form(){
//   form_data=await get_form_vals("add_business_form")
//   link='process-business-form'
//   console.log(form_data)
//   res=await post_data_async(link,form_data)
//   console.log(res)
//   $("#add-business-div").hide()
//   $("#add-business-success-message").show()

// }



function go_add_location(){
  if (qs=="") return
  dest_page_url="add-location?"+qs  
  window.open(dest_page_url, "_self")
}

function go_add_product(){
  if (qs=="") return
  dest_page_url="add-product?"+qs  
  window.open(dest_page_url, "_self")
}

function go_add_service(){
  if (qs=="") return
  dest_page_url="add-service?"+qs  
  window.open(dest_page_url, "_self")
}

async function submit_complete_profile_location_form(){
  form_data=await get_form_vals("complete_profile_form")
  link='process-business-form'
  console.log(form_data)
  res=await post_data_async(link,form_data)
  console.log(res)
  city_id=form_data["location_0-city"]
  company_id=res.id

}



async function submit_onboarding_form(){
  form_data=await get_form_vals("onboarding_form")
  link='process-business-form'
  console.log(form_data)
  res=await post_data_async(link,form_data)
  console.log(res)
  city_id=form_data["location_0-city"]
  company_id=res.id
  // if (qs=="") success_page_url="add-business-success?city="+city_id+"&company="+company_id
  // else success_page_url="add-business-success"+qs+"&city="+city_id+"&company="+company_id

  if (qs=="") success_page_url="complete-business-profile?city="+city_id+"&company="+company_id
  else success_page_url="complete-business-profile?"+qs+"&city="+city_id+"&company="+company_id


  console.log(success_page_url)

  //window.open(success_page_url, "_self")
  

  // $("#add-business-div").hide()
  // $("#add-business-success-message").show()

}

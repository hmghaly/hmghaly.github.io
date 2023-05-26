var qs=window.location.search.slice(1)

qs_dict=parse_qs()

app_name="alif"
data_dict=get_local_storage_data(app_name)
if (data_dict==null || data_dict==undefined) data_dict={}

var topic_data={}
var quiz_dict={}
var timer={}
var performance_dict={}
var cur_q={}
var cur_answer=[]

var nav_path=[]

var google_profile=null
var facebook_profile=null

var quiz_time_min="1" //minute

lang_dict={"msa":{},"ega":{}}
lang_dict["msa"]["name"]="Modern Standard Arabic"
lang_dict["msa"]["image"]="assets/img/arabic.svg"
lang_dict["ega"]["name"]="Egyptian Arabic"
lang_dict["ega"]["image"]="assets/img/egypt.svg"






user=data_dict["user"]
coins=data_dict["coins"]||0
hints=data_dict["hints"]||5
data_dict["coins"]=coins
data_dict["hints"]=hints

score_dict=data_dict["score"]||{} //today()
data_dict["score"]=score_dict
today_score=score_dict[today()]||0
data_dict["score"][today()]=today_score

streak_dict=data_dict["streak"]||{} //today()
data_dict["streak"]=streak_dict
var yesterday_streak=streak_dict[yesterday()]||0

time_played_dict=data_dict["time_played"]||{} //today()
data_dict["time_played"]=time_played_dict
today_time_played=time_played_dict[today()]||0
data_dict["time_played"][today()]=today_time_played

settings_dict=data_dict["settings"]



assigned_user_id=assign_user_key(app_name,data_dict)
session_id=create_key()
session_dict={}
session_dict["id"]=session_id
session_dict.items=[]

console.log("assigned_user_id",assigned_user_id)
console.log("session_dict",session_dict)

$( document ).ready(init);

function init(){
    console.log( "ready!" );
    if (qs=="no") return
    qs_screen=qs_dict["screen"]
	if (qs_screen!=null){
		show_id_hide_class(qs_screen,"screen")
		if (qs_screen!="intro") $$("footer").hidden=false;
		return
	}
    show_id_hide_class("intro","screen")
	console.log("data_dict",data_dict)	
	if (data_dict!=null && data_dict["language"]!=null) nav_path=[data_dict["language"]]

	if (settings_dict==null || Object.keys(settings_dict).length === 0){
		console.log("empty settings")
		settings_dict=get_vals("settings_form")
		data_dict["settings"]=settings_dict
	}
	else {
		apply_form_vals(settings_dict,"settings_form")
	}
	console.log(settings_dict)

	$$("n_streak_days").innerHTML=str(yesterday_streak)
	today_streak=data_dict["streak"][today()]
	if (today_streak!=null) $$("n_streak_days").innerHTML=str(today_streak)

	update_local_data()
}

function update_local_data(){
	set_local_storage_data(app_name,data_dict)
}


function update_settings(){
	settings_dict=get_vals("settings_form")
	data_dict["settings"]=settings_dict
	update_local_data()
	alert("updated settings")
	go2main_menu()
}

function save_key_val(key0,val0){
	data_dict[key0]=val0
	set_local_storage_data(app_name,data_dict)
}

function reset_local_data(){
	data_dict={}
	update_local_data()
}

function go2screen(screen_id){
	show_id_hide_class(screen_id,"screen")
}

function after_intro(){
	if (data_dict==null || data_dict["language"]==null) show_id_hide_class("choose_language","screen")
	else if (data_dict==null || user==null) show_id_hide_class("login_signup","screen")
	else show_id_hide_class("main_menu","screen")
	$$("footer").hidden=false;

	//show_id_hide_class("choose_language","screen")

}

function go2lang_selection(){
	show_id_hide_class("choose_language","screen")
}

function after_lang_selection(obj1){
	obj_name=obj1.name
	selected_lang=obj_name.split("-")[1]
	save_key_val("language",selected_lang)
	nav_path=[selected_lang]
	//data_dict["language"]=selected_lang
	//update_local_data()
	if (data_dict==null || user==null) show_id_hide_class("login_signup","screen")
	else show_id_hide_class("main_menu","screen")
	//console.log(selected_lang)
	//show_id_hide_class("main_menu","screen")

}

function go2settings(){
	show_id_hide_class("settings","screen")
}

function go2shop(){
	show_id_hide_class("shop","screen")
}

function go2profile(){
	show_id_hide_class("profile","screen")
}


function go2main_menu(){
	console.log("go 2 main_menu")
	show_id_hide_class("main_menu","screen")
}	

function go2learn_menu(){
	show_id_hide_class("learn_menu","screen")
}

async function go2learn_topic(obj1){
	selected_lang=data_dict["language"]
	nav_path=[selected_lang]
	console.log("go2learn_topic", obj1)
	obj_name=obj1.name
	selected_topic_id=obj_name.split("-")[1] //the topic id is the second part of the button name
	console.log(selected_topic_id)
	nav_path.push(selected_topic_id) // we add the topic id to current nav_path
	console.log(nav_path)

	topic_data=await load_topic_data(selected_topic_id)	
	lesson_list=topic_data["lesson_list"]
	if (lesson_list==null) lesson_list=[]
	show_id_hide_class("topic_menu","screen") //perhaps it should be topic menu
	deploy_lesson_list_table(lesson_list)

	quiz_btn=$$("topic_menu_quiz_button")
	quiz_btn.dataset.value=nav_path.join(":")


	
}

function deploy_lesson_list_table(lesson_list0){
	lesson_tbodyRef =$$("table_body_lessons")
	lesson_tbodyRef.innerHTML=""
	for (i0 in lesson_list0){
		item0=lesson_list0[i0]
		lesson_name=item0["lesson_name"]
		lesson_id=item0["lesson_id"] || item0["id"]
		tmp_nav_path=nav_path.slice();
		tmp_nav_path.push(lesson_id)
		//console.log("tmp_nav_path",tmp_nav_path)

		var newRow = lesson_tbodyRef.insertRow();
		if (i0 % 2 == 0) newRow.className='bg-gray-200'
		var newCell_0 = newRow.insertCell();
		var newCell_1 = newRow.insertCell();
		var newCell_2 = newRow.insertCell();
		link0=create_el_basic("a",newCell_0)
		link0.href="javascript:void(0)"
		link0.innerHTML=lesson_name
		link0.id="lesson-"+lesson_id
		link0.dataset.value=tmp_nav_path.join(":")
		link0.onclick=go2lesson
		newCell_1.className="text-center"
		newCell_2.className="text-center"
		button0=create_el_basic("button",newCell_1)
		button0.id="quiz_btn-"+lesson_id
		button0.className="px-2 py-1 w-2/3 text-base text-xs text-center text-white bg-blue-700 rounded-lg m-1"
		button0.innerHTML="Quiz"
		button0.onclick=go2quiz
		button0.dataset.value=tmp_nav_path.join(":")
		button0.dataset.id=lesson_id

		newCell_2.innerHTML="-"



	}

}

function go2lesson(obj0){
	trg0=obj0.target
	if (trg0==null) trg0=obj0
	id0=trg0.id
	lesson_id0=id0.split("-")[1]
	console.log(lesson_id0) //now open the lesson
	console.log(trg0.dataset)
	//open_lesson(lesson_id0)
}

function go2quiz(obj0){
	trg0=obj0.target
	if (trg0==null) trg0=obj0
	show_id_hide_class("quiz","screen")
	console.log(trg0.dataset.value)
	quiz_question_set=gen_quiz(trg0.dataset.value)
	//console.log("quiz_question_set",quiz_question_set)
	//we should be sorting questions by weight here - TODO
	quiz_dict={}
	quiz_dict["questions"]=quiz_question_set
	quiz_dict["i"]=0
	start_quiz()
	cur_q_obj=quiz_dict["questions"][quiz_dict["i"]]
	deploy_q(cur_q_obj)
	

	// console.log(trg0)
	// console.log(trg0.dataset)
}



function gen_quiz(path0){
	max_n=100
	n_questions=50
	split_path0=path0.split(":")
	quiz_lang=split_path0[0]
	quiz_topic=split_path0[1]
	quiz_lesson=null
	if (split_path0.length>2) quiz_lesson=split_path0[2]
	var used_paths=[]
	question_list=[]

	//if no lesson specified
	lesson_list=topic_data["lesson_list"]
	console.log("gen_quiz lesson_list",lesson_list)
	console.log("gen_quiz quiz_lesson",quiz_lesson)
	for (var i=0;i<max_n;i++){
		cur_lesson_item=get_random_item(lesson_list) //lesson_list[getRandomInt(len(lesson_list))]
		cur_lesson_id=cur_lesson_item["lesson_id"] || cur_lesson_item["id"] 
		if (quiz_lesson!=null) cur_lesson_id=quiz_lesson
		//console.log(i,cur_lesson_item)
		question_obj0=gen_question(quiz_lang,quiz_topic,cur_lesson_id)
		if (question_obj0==null) continue
		path0=question_obj0["path"]
		if (is_in(path0,used_paths)) continue
		used_paths.push(path0)
		question_list.push(question_obj0)
		console.log("question_obj0", question_obj0)
		if (len(question_list)>=n_questions) break
	}
	// for (ll of lesson_list){
	// 	console.log(ll)
	// }
	return question_list
}

function update_progress_display(num0,num1,progess_el_id){
	cur_progress_el_obj=$$(progess_el_id)
	cur_str=""+num0+"/"+num1
	cur_progress_el_obj.innerHTML=cur_str
	ratio0=Math.floor(100*num0/num1)
	cur_progress_el_obj.style.width=""+ratio0+"%"
}

function get_cur_accuracy_val(){
	attempted0=quiz_dict["attempted"] || 0
	correct0=quiz_dict["correct"] || 0
	if (attempted0==0) return 0
	accuracy0=correct0/attempted0
	return accuracy0
}

function update_quiz_accuracy_val(is_correct){
	attempted0=quiz_dict["attempted"] || 0
	correct0=quiz_dict["correct"] || 0
	attempted0+=1
	if (is_correct) correct0+=1
	accuracy0=correct0/attempted0
	quiz_dict["attempted"]=attempted0
	quiz_dict["correct"]=correct0
	quiz_dict["accuracy"]=accuracy0
	return accuracy0
}

function get_score(){
	attempted0=quiz_dict["attempted"] || 0
	correct0=quiz_dict["correct"] || 0
	if (attempted0==0) return 0
	accuracy0=correct0/attempted0
	score0=correct0*accuracy0
	return Math.round(score0) 

}

function update_accuracy_display(accuracy_val,accuracy_el_id){
	cur_accuracy_el_obj=$$(accuracy_el_id)
	ratio0=Math.floor(100*accuracy_val)
	cur_accuracy_el_obj.innerHTML=""+ratio0+"%"	

}


function start_quiz(){
	console.log("starting quiz")
	quiz_time_min=settings_dict["quiz_time_minutes"]||"2"
	quiz_time=Number(quiz_time_min)*60
	
	//timer.time_remaining=10
	update_progress_display(quiz_dict["i"],len(quiz_dict["questions"]),"quiz_progress_bar")
	update_accuracy_display(1,"quiz_accuracy")
	start_timer(quiz_time,"time_remaining",end_quiz)
}

function end_quiz(){
	//if timer=
	if (is_empty(timer)) return
	console.log("quiz ended")
	timer={}
	show_id_hide_class("after_quiz","screen")
	cur_score=get_score()
	data_dict["score"][today()]+=cur_score
	total_today_score=data_dict["score"][today()]
	cur_accuracy_val=get_cur_accuracy_val()
	update_accuracy_display(cur_accuracy_val,"your_current_accuracy_value")


	$$("your_current_score_value").innerHTML=str(cur_score)
	$$("your_score_today_value").innerHTML=str(total_today_score)
	correct_count0=quiz_dict["correct"]||0
	attempted_count0=quiz_dict["attempted"]||0
	$$("after_quiz_correct_count").innerHTML=str(correct_count0)
	$$("after_quiz_attempted_count").innerHTML=str(attempted_count0)
	quiz_time_val=Number(settings_dict["quiz_time_minutes"])
	daily_goal_minutes_val=Number(settings_dict["daily_goal_minutes"])
	data_dict["time_played"][today()]+=quiz_time_val
	if (data_dict["time_played"][today()]>=daily_goal_minutes_val){
		console.log("daily goal achieved")
		//yesterday_streak=data_dict["streak"][yesterday()]||0
		today_streak=yesterday_streak+1
		data_dict["streak"][today()]=today_streak
		if (today_streak!=null) $$("n_streak_days").innerHTML=str(today_streak)

	}


	update_local_data()
	quiz_dict={}



}

async function check_answer(obj0){
	trg0=obj0
	if (obj0.target!=null) trg0=obj0.target
	//obj0.style.backgroundColor="Yellow"	
	// obj0.classList.add("checking_answer")
	// await gsap.to(".checking_answer", {backgroundColor:"yellow", opacity: 1, duration: 0.5});

	console.log(trg0.dataset)
	cur_val=trg0.dataset.value
	norm_answer=cur_q["correct_answer"] //normative answer, the one we compare to


	cur_answer_copy=copy_obj(cur_answer) // the answer we input
	norm_answer_val=norm_answer[len(cur_answer)]
	if (norm_answer_val.value!=null) norm_answer_val=norm_answer_val.value
	cur_answer_copy.push(cur_val)
	//console.log("cur_answer_copy",cur_answer_copy)
	answer_is_correct=false
	proceed_2_next=false


	if (cur_val==norm_answer_val && len(cur_answer_copy)==len(norm_answer)){
		console.log("Correct Answer!") 
		answer_is_correct=true
		cur_answer=cur_answer_copy
		proceed_2_next=true
		//next_q()
	}
	else if (cur_val==norm_answer_val){
		console.log("Correct sequence Answer!") 
		cur_answer=cur_answer_copy
		console.log(cur_answer)
		answer_is_correct=true
	}

	cur_accuracy0=update_quiz_accuracy_val(answer_is_correct)
	update_accuracy_display(cur_accuracy0,"quiz_accuracy")




	if (answer_is_correct) {
		await on_correct_answer(trg0)
	} 
	else {
		await on_wrong_answer(trg0)
	} 

	if (proceed_2_next) next_q()
	//console.log(cur_q)

}


async function on_correct_answer(obj0){
	obj0.classList.add("correct_answer")
	obj0.onclick=function(){}
	rect1=obj0.getBoundingClientRect()

	gsap.to(".correct_answer", {backgroundColor:"green", opacity: 0.2, duration: 1});

	$$("quiz_answer_space").innerHTML=cur_answer.join("")

	cur_coin=img("assets/img/coin.png",onload=null,id="")
	cur_coin.height=15
	cur_coin.width=15
	cur_coin.style.zIndex = "2";
	cur_coin.style.position = 'absolute';
	obj0.appendChild(cur_coin)
	dist_obj1=get_dist(cur_coin,$$("coin_img"))
	await gsap.to(cur_coin, {duration: 1, x:dist_obj1.delta_x,y: dist_obj1.delta_y,onComplete:show_coin});
	cur_coin.remove()
	//obj0.innerHTML="&#9989;"
	
	//obj0.remove();


}

function show_coin(){
	data_dict["coins"]+=1
	$$("quiz_coin_count").innerHTML=data_dict["coins"]
	update_local_data()
	console.log(this)
}

async function on_wrong_answer(obj0){
	obj0.classList.add("wrong_answer")
	await gsap.to(".wrong_answer", {backgroundColor:"PaleVioletRed", opacity: 1, duration: 0.2});
	
}



function next_q(){
	quiz_dict["i"]+=1
	update_progress_display(quiz_dict["i"],len(quiz_dict["questions"]),"quiz_progress_bar")
	if (quiz_dict["i"]>=len(quiz_dict["questions"])) {
		alert("congratulations! You completed all questions in this set")
		end_quiz()
		return 
	}
	cur_q_obj=quiz_dict["questions"][quiz_dict["i"]]
	deploy_q(cur_q_obj)

}



function deploy_q(q_obj){
	cur_q=q_obj
	cur_answer=[]
	console.log(q_obj)
	$(".quiz_items").html("")
	$(".quiz_input").hide()
	$$("quiz_prompt").innerHTML=q_obj["prompt"] //"What is this word?"
	$$("quiz_coin_count").innerHTML=data_dict["coins"]
	$$("quiz_item_label").innerHTML=q_obj["q_item_label"]
	is_mcq=false
	is_seq=false

	if (cur_q.options!=null && len(cur_q.options)!=0) is_mcq=true
	if (cur_q.seq!=null && len(cur_q.seq)!=0) is_seq=true

	if (is_mcq){
		$("#quiz_mcq_options").show()
		cur_input_div=$$("quiz_mcq_options")
		for (input_item0 of cur_q.options){
			input_item_el0=create_el_basic("button",cur_input_div)
			input_item_el0.className="bg-blue-500 hover:bg-blue-700 text-xl text-white font-bold py-1 px-4 w-2/3 m-2 rounded-lg"
			input_item_el0.dataset.value=input_item0.value
			input_item_el0.dataset.id=input_item0.id
			input_item_el0.innerHTML=input_item0.value
			input_item_el0.onclick=check_answer

		}

	}
	if (is_seq){
		$("#quiz_seq_selection").show()
		cur_input_div=$$("quiz_seq_selection")
		for (input_item0 of cur_q.seq){
			input_item_el0=create_el_basic("button",cur_input_div)
			input_item_el0.className="bg-blue-500 hover:bg-blue-700 text-xl text-white font-bold py-1 px-4 m-2 rounded"
			input_item_el0.dataset.value=input_item0.value
			input_item_el0.dataset.id=input_item0.id
			input_item_el0.innerHTML=input_item0.value
			input_item_el0.onclick=check_answer

		}
		
	}


		//quiz_mcq_options

	//q_obj["deploy_t0"]=0

	
	//quiz_question
	//quiz_prompt
	//quiz_extra
	//quiz_image
	//quiz_audio
	//quiz_tags
	//quiz_answer_space
	//quiz_answer_feedback
	//quiz_mcq_options
	//quiz_seq_selection
	//quiz_input_type (mcq - seq - keyboard)
	
}



// q_type_dict={}
// q_type_dict["letter_names"]={}
// q_type_dict["letter_names"]["recognize"]=["arabic_script","letter_name"]
// q_type_dict["letter_names"]["use"]=["letter_name","arabic_script"]
// q_type_dict["letter_sounds"]={}
// q_type_dict["letter_sounds"]["recognize"]=["arabic_script","letter_sound"]
// q_type_dict["letter_sounds"]["use"]=["letter_sound","arabic_script"]
// q_type_dict["diacritics"]={}
// q_type_dict["diacritics"]["recognize"]=["arabic_script","letter_name"]
// q_type_dict["diacritics"]["use"]=["letter_name","arabic_script"]
// q_type_dict["letter_sounds_diacritics"]={}
// q_type_dict["letter_sounds_diacritics"]["recognize"]=["letter_diacritic","letter_sound"]
// q_type_dict["letter_sounds_diacritics"]["use"]=["letter_sound","letter_diacritic"]
// q_type_dict["extended_letter_names"]={}
// q_type_dict["extended_letter_names"]["recognize"]=["arabic_script","letter_name"]
// q_type_dict["extended_letter_names"]["use"]=["letter_name","arabic_script"]
// q_type_dict["letter_shapes"]={}
// q_type_dict["letter_shapes"]["recognize"]=["letter_shapes","letter_name"]
// q_type_dict["letter_shapes"]["use"]=["letter_name","letter_shapes"]
// q_type_dict["sound_out_words"]={}
// q_type_dict["sound_out_words"]["recognize"]=["arabic_word","id"] //simple mcq: arabic > romanized
// q_type_dict["sound_out_words"]["use"]=["id","arabic_word"] //simple mcq romanized > arabic word
// q_type_dict["sound_out_words"]["recognize_ar_seq"]=["arabic_word","chunks"] //q: arabic word , a: arabic chunks
// q_type_dict["sound_out_words"]["use_rom_ar_seq"]=["id","chunks"] //q romanized word, a: arbic chunks
// q_type_dict["sound_out_words"]["recognize_ar_rom_seq"]=["arabic_word","romanized_chunks"] //q: arabic_word, a:romanized chunks
// q_type_dict["nouns"]={}
// q_type_dict["nouns"]["recognize"]=["arabic_word","english"] //simple mcq: arabic > romanized
// q_type_dict["nouns"]["use"]=["english","arabic_word"] //simple mcq: arabic > romanized

//vocab
//verbs
//grammar



//arabic_script

function get_list_item_by_id(list0,item_id){
	selected_item=null
	for (item1 of list0) {
		if (item1.id==item_id){
			selected_item=item1
		}
	}
	return selected_item	
}

function gen_question(lang_id,topic_id,lesson_id,q_type=null,item_id=null,input_type=null,n_options=4){
	applicable_questions=[]
	q_type_list=topic_data["question_types"]
	for (type_item0 of q_type_list){
		if (lesson_id!=null && type_item0["lesson_id"]!=lesson_id) continue
		if (q_type!=null && type_item0["question_type"]!=q_type) continue
		applicable_questions.push(type_item0)	
	}
	if (len(applicable_questions)==0){
		for (type_item0 of q_type_list){
			if (type_item0["lesson_id"]=="default"){
				type_item0["lesson_id"]=lesson_id //for question type object, we need to keep the lesson_id as originally called instead of default, so we can use it to retrieve corresponding data
				applicable_questions.push(type_item0)
			}
			// if (type_item0["lesson_id"]!="-" || type_item0["lesson_id"]!="default") continue
			// if (q_type!=null && type_item0["question_type"]!=q_type) continue
				
		}		
	}
	if (len(applicable_questions)==0) return null
	console.log("applicable_questions",applicable_questions)
	cur_q_type_item=get_random_item(applicable_questions)
	console.log(cur_q_type_item)
	lesson_id=cur_q_type_item["lesson_id"]
	cur_columns=cur_q_type_item["columns"]
	var q_obj=gen_options(lesson_id,item_id,cur_columns,n_options)
	if (q_obj==null) return null
	q_type=cur_q_type_item["question_type"]
	q_obj["q_type"]=q_type //q_type
	item_id=q_obj["item_id"]
	//q_obj["data"]=q_options_obj0
	q_path_items=[lang_id,topic_id,lesson_id,item_id,q_type]
	q_obj["path"]=q_path_items.join(":")
	for (const [key, value] of Object.entries(cur_q_type_item)) {
		if (key=="id") q_obj["question_type_id"]=value
		else q_obj[key]=value
	  //console.log(`${key}: ${value}`);
	}
	console.log(q_obj)

	//q_obj["correct"]=item_id
	//console.log(selected_item)
	//console.log(options)
	return q_obj

}

// function gen_question(lang_id,topic_id,lesson_id,item_id=null,q_type=null,input_type=null,n_options=4){

// 	if (q_type==null){
// 		applicable_q_types=Object.keys(q_type_dict[lesson_id]) //identify the possible question types for this lesson
// 		q_type=get_random_item(applicable_q_types)
// 	}
	
// 	//console.log(selected_item, q_type,columns)
// 	var q_obj=gen_options(lesson_id,item_id,q_type,n_options)
// 	q_obj["q_type"]=q_type
// 	item_id=q_obj["item_id"]
// 	//q_obj["data"]=q_options_obj0
// 	q_path_items=[lang_id,topic_id,lesson_id,item_id,q_type]
// 	q_obj["path"]=q_path_items.join(":")

// 	//q_obj["correct"]=item_id
// 	//console.log(selected_item)
// 	//console.log(options)
// 	return q_obj
// }

function gen_options(lesson_id,item_id,columns,n_options,option_ids=null){
	q_opt_obj={}

	data_list=topic_data[lesson_id] //get the corresponding lesson data
	//console.log(data_list,"lesson_id",lesson_id)
	if (data_list==null || len(data_list)==0) return null
	
	// if (q_type_dict[lesson_id]==null){

	// }
	// else columns=q_type_dict[lesson_id][q_type]

	selected_item={}
	if (item_id==null) selected_item=get_random_item(data_list) 
	else selected_item=get_list_item_by_id(data_list,item_id) //identify the selected data item, that we will ask about
	item_id=selected_item.id
	q_opt_obj["item_id"]=item_id
	console.log("gen_options item_id", item_id,"selected_item",selected_item)
	console.log("item_id", item_id,"columns",columns)
	//console.log(data_list)
	console.log("selected_item",selected_item)



	head_id0=columns[0]
	head_id1=columns[1]
	correct_id=selected_item.id
	q_item_label=selected_item[head_id0] //the label to be displayed in the question - also question item, but to avoid confusion with question object
	correct_option_item=selected_item[head_id1]
	//console.log("q_item_label",q_item_label)
	// console.log("selected_item",selected_item)
	// console.log("head_id0",head_id0, selected_item[head_id0])
	// console.log("head_id1",head_id1, selected_item[head_id1])

	if (head_id0.includes("shape")) q_item_label=get_random_item(q_item_label) 
	if (head_id1.includes("shape")) correct_option_item=get_random_item(correct_option_item) 	
	q_opt_obj["correct_id"]=correct_id
	
	is_seq_question=Array.isArray(correct_option_item) //check if the question will have list of options, or a sequence to be completed
	answer0=correct_option_item //either a string or a list - we should clean this

	if (!is_seq_question) answer0=[answer0] //make sure the answer is an array whether it is sequence or option
	q_opt_obj["correct_answer"]=answer0	
	q_opt_obj["q_item_label"]=q_item_label //the thing we ask about in the quiz question

	//console.log("q_item",q_item,"correct_option_item",correct_option_item)
	correct_option_obj={}
	correct_option_obj["id"]=correct_id
	//correct_option_obj["label"]=correct_option_item
	correct_option_obj["value"]=correct_option_item

	option_list=[]
	sq_list=[]
	if (is_seq_question){
		for (seq0 of correct_option_item){
			// seq_obj={}
			// seq_obj["value"]=seq0	
			sq_list.push(seq0)		
		}
	}
	else option_list.push(correct_option_obj)
	n_correct_seq=len(sq_list)
	n_seq_padding=2 //how many items we add to the sequence
	//option_list=[correct_option_obj]


	data_list_shuffled=shuffle(data_list)
	for (obj1 of data_list_shuffled){
		if (obj1.id==correct_id) continue
		if (len(option_list)==n_options) break
		if (len(sq_list)>=n_correct_seq+n_seq_padding) break
		cur_option_item=obj1[head_id1]
		if (head_id1.includes("shape")) cur_option_item=get_random_item(cur_option_item) 	
		op_obj={}
		op_obj["id"]=obj1.id
		//op_obj["label"]=cur_option_item
		op_obj["value"]=cur_option_item
		
		if (!is_seq_question) option_list.push(op_obj)
		else {
			for (seq0 of cur_option_item){
				if (is_in(seq0,sq_list)) continue
				sq_list.push(seq0)	
				if (len(sq_list)>=n_correct_seq+n_seq_padding) break					
			}
		}
	}
	q_opt_obj["options"]=shuffle(option_list)
	q_opt_obj["seq"]=shuffle(sq_list)
	//console.log(option_list)
	return q_opt_obj


}



async function load_topic_data(topic_id){
	fname='msa-read_write.json'
	if (topic_id=='read_write') fname='msa-read_write.json'
	if (topic_id=='vocab') fname='msa-vocab.json'
	if (topic_id=='verbs') fname='msa-verbs.json'
	if (topic_id=='grammar') fname='msa-grammar.json'
		
	data_url="assets/data/"+fname
	topic_data0=await read_json_async(data_url)
	console.log(topic_data0)
	return topic_data0
}







//login and signup process
async function on_login(){
	val_dict=await get_form_vals("login_form")
	console.log(val_dict)
	email_is_valid=check_email_str(val_dict.email)
	if (!email_is_valid) {
		alert("invalid email addess")
		return 
	}
	
	//server password validation
	save_key_val("user",val_dict.email)
	show_id_hide_class("main_menu","screen")

}

async function on_signup(){
	val_dict=await get_form_vals("signup_form")
	console.log(val_dict)
	email_is_valid=check_email_str(val_dict.email)
	if (!email_is_valid) {
		alert("invalid email addess")
		return 
	}
	//server password validation
	save_key_val("user",val_dict.email)
	show_id_hide_class("main_menu","screen")

}

//Facebook and google login sequences
function onSignIn(googleUser) {
    // Useful data for your client-side scripts:
    //console.log(googleUser)
    var profile = googleUser.getBasicProfile();
    google_profile={}
    google_profile["id"]=profile.getId()
    google_profile["full_name"]=profile.getName()
    google_profile["first_name"]=profile.getGivenName()
    google_profile["family_name"]=profile.getFamilyName()
    google_profile["image_url"]=profile.getImageUrl()
    google_profile["email"]=profile.getEmail()
    google_profile["id_token"]=googleUser.getAuthResponse().id_token
    
    //console.log(profile)
    // console.log("ID: " + profile.getId()); // Don't send this directly to your server!
    // console.log('Full Name: ' + profile.getName());
    // console.log('Given Name: ' + profile.getGivenName());
    // console.log('Family Name: ' + profile.getFamilyName());
    // //console.log("Image URL: " + profile.getImageUrl());
    // console.log("Email: " + profile.getEmail());

    // The ID token you need to pass to your backend:
    var id_token = googleUser.getAuthResponse().id_token;
    //console.log("ID Token: " + id_token);
  }


//google    
function onSuccess(googleUser) {
  console.log('Logged in as: ' + googleUser.getBasicProfile().getName());
    var profile = googleUser.getBasicProfile();
    google_profile={}
    google_profile["id"]=profile.getId()
    google_profile["name"]=profile.getName()
    google_profile["first_name"]=profile.getGivenName()
    google_profile["family_name"]=profile.getFamilyName()
    google_profile["image_url"]=profile.getImageUrl()
    google_profile["email"]=profile.getEmail()
    google_profile["id_token"]=googleUser.getAuthResponse().id_token
    
    //google_profile= googleUser.getBasicProfile()  
}

//google
function onFailure(error) {
  console.log(error);
}
    

//google
function renderButton() {
	gapi.signin2.render('my-signin2', {
	'scope': 'profile email',
	'width': 240,
	'height': 40,
	'longtitle': true,
	'theme': 'dark',
	'onsuccess': onSuccess,
	'onfailure': onFailure
	});
}

//facebook    
function fb_login(){
    FB.login(function(response) {
      // handle the response
        console.log("login", response)
        fb_userId = response.authResponse.userID;
        console.log(fb_userId)
        FB.api(
              '/'+fb_userId+'/?fields=id,name,email',
              'GET',
              {},
              function(response1) {
                // Insert your code here
                console.log(response1);
                facebook_profile=response1
                let email = response1.email;
                if (email!=null) data_dict["user"]=email
                //loginViaEmail(email);
              }
            );
    }, {scope: 'public_profile,email'});
}

//facebook    
function checkLoginState() {
    FB.getLoginStatus(function(response) {
        console.log(response)
      statusChangeCallback(response);
    });
  }

//facebook
function statusChangeCallback(response) {
// body...
if(response.status === 'connected'){
  // setElements(true);
  let userId = response.authResponse.userID;
  // console.log(userId);
  console.log('login');
  getUserInfo(userId);

}
else{
  // setElements(false);
  console.log('not logged in !');
}
}
    

//facebook
function getUserInfo(userId) {
// body...
FB.api(
  '/'+userId+'/?fields=id,name,email',
  'GET',
  {},
  function(response) {
    // Insert your code here
    console.log(response);
    facebook_profile=response
    let email = response.email;
    //loginViaEmail(email);
  }
);
}
    
async function continue_with_google(){
  
}
  
async function continue_with_facebook(){
  await fb_login()
  console.log(facebook_profile)
  if (facebook_profile.email!=null) data_dict["user"]=facebook_profile.email
}
    
    
function fb_logout(){
  FB.api('/me/permissions', 'delete', function(response) {
    console.log(response.status); // true for successful logout.
});  	
}


function google_logout() {
    gapi.auth2.getAuthInstance().signOut().then(function () {
      console.log('User signed out.');
      location.reload();
    });

}

from stories import Story

# # Here's a story to get you started

story1 = Story(
    ["place", "noun", "verb", "adjective", "plural_noun"],
    """Once upon a time in a long-ago {place}, there lived a
       large {adjective} {noun}. It loved to {verb} {plural_noun}. {noun}"""
)

#Stories

story2 = Story(
    ["name_1","name_2","name_3", "adjective_1", "plural_noun_1", "occupation_or_role", "adjective_2", 
     "infinitive_verb_1", "infinitive_verb_2", "plural_noun_2", "infinitive_verb_3", "adverb_1", "infinitive_verb_4", "noun_1",
     "infinitive_verb_5", "infinitive_verb_6", "noun_2", "occupation_or_role_2", "infinitive_verb_7", "noun_3", "adjective_3",  
     "adverb_2", "infinitive_verb_8", "adjective_4", "infinitive_verb_9", "adjective_5", "adjective_6", "infinitive_verb_10",
     "past_tense_verb_1", "place", "adjective_7", "plural_noun_3", "plural_noun_4"
     ],
    """Once up a time, there were three {adjective_1} {plural_noun_1} named {name_1}, {name_2} and {name_3}. One day, their {occupation_or_role} said, 
    \"You are {adjective_2} and must {infinitive_verb_1}.\" So they went to {infinitive_verb_2} their {plural_noun_2}.
    {name_1} wanted only to {infinitive_verb_3} all day and {adverb_1} {infinitive_verb_4}s his {noun_1}. 
    {name_2} wanted to {infinitive_verb_5} and {infinitive_verb_5} all day, so she {infinitive_verb_6}s her {noun_2}. 
    {name_3} knew the {occupation_or_role_2} lived nearby and worked hard to {infinitive_verb_7} his {noun_3}.
    One day, the {occupation_or_role_2} saw {name_1}\'s {noun_1} and said \"Your {noun_1} is {adjective_3}.\" 
    Then the {occupation_or_role_2} proceeded to {adverb_2} {infinitive_verb_8} {name_1}.
    The {occupation_or_role_2} then saw {name_2}\'s {noun_2} and said \"Your {noun_2} is very {adjective_4}.\"
    Then the {occupation_or_role_2} decided to {infinitive_verb_9} {name_2}.
    Then the {occupation_or_role_2} saw {name_3}\'s {adjective_5} {noun_3} and said 
    \"Your {noun_3} is the most {adjective_6} {noun_3} ever.\"
    The {occupation_or_role_2} tried to {infinitive_verb_10} {name_3}, but couldn\'t because {name_3} {past_tense_verb_1}
    the {occupation_or_role_2}, causing the {occupation_or_role_2} to run all the way back to {place}.
    After a long day, the three {adjective_1} {plural_noun_1}, went home and enjoyed a {adjective_7} dinner with 
    mashed {plural_noun_3} and boiled {plural_noun_4}
    """    
)

story3 = Story (
    ["activity", "adjective_1","type_of_place", "plural_noun_1","adjective_2","name_1","infinitive_verb_1","plural_animal","name_2", 
    "plural_noun_3","adjective_3", "noun_3", "adverb_1", "infinitive_verb_2", "emotion_1", "plural_body_part", "present_tense_verb_1",
    "adverb_2", "adjective_superlative", "adjective_4", "adjective_5"
     ],
    """ Today, my {activity} group went to a(an) {adjective_1} {type_of_place}. It had lots of {adjective_2} {plural_noun_1}. 
        When we got there, {name_1} shouted loudly, \"It\'s time to {infinitive_verb_1} like a bunch of {plural_animal}".
        {name_2} got everyone {plural_noun_3}. I was so excited! I couldn\'t decide what to do first. I saw a {adjective_3} {noun_3} I really liked so, I 
        {adverb_1} ran to get in the long line for the {adjective_3} {noun_3}. When I finally got to {infinitive_verb_2} the {noun_3} I was so {emotion_1}.
        In fact, I was so {emotion_1} that my two {plural_body_part} were {present_tense_verb_1} {adverb_2}. This was the {adjective_superlative} {noun_3} ever! 
        I was a little {adjective_4}, but I was proud of myself. It was a {adjective_5} day at the {adjective_1} {type_of_place}.
    """ 
)

story4 = Story(
    ["adjective_1", "adjective_2", "type_of_place ","number", "adjective_3", "adjective_4","animal_1", "animal_2", "name", "present_tense_verb_1",
     "present_tense_verb_2", "adjective_5", "adjective_6"],
    """Every summer, I get excited and {adjective_1} to go camping in the deep, {adjective_2} forests. It's good to get away from the hustle and bustle 
    of the {type_of_place}. Last year, my friend and I went hiking and got lost for {number} hour(s). We started off on a(n) {adjective_3} adventure, 
    but we kept losing the trail. Night fell, and when we heard the howls of a {adjective_4} {animal_1}, we began to panic. It was getting darker and our 
    flashlights were running on low. I'm sure glad my pet {animal_2}, {name}, was with us. It made {present_tense_verb_1} noises to scare of the {animal_1},
    and it was able to guide us back. After that ordeal, we began {present_tense_verb_2} the {adjective_5} s'mores by the campfire. This year, before 
    setting off on a(n) {adjective_3} journey, I'll be sure to have working flashlights - and of course, my {adjective_6} pet!
    """
)

story5 = Story(
    ["noun_1", "place", "present_tense_verb_1", "plural_noun_1", "type_of_place","name", "occupation_or_role", "type_of_liquid", 
     "type_of_place_2", "past_tense_verb_1", "kitchen_appliance","type_of_place_3", "present_tense_verb_2", "noun_2"],        
    """A {noun_1} in {place} was arrested this morning after s/he was caught {present_tense_verb_1} in front of {plural_noun_1} at the {type_of_place}. 
    {name} had a history of {present_tense_verb_1}, but no one-not even his {occupation_or_role} ever imagined {name} would do such a thing.
     After drinking some {type_of_liquid}, cops followed him to a {type_of_place_2} where s/he reportedly {past_tense_verb_1} in the {kitchen_appliance}. 
     When s/he saw the cops s/he ran to a {type_of_place_3}, whe s/he was caught {present_tense_verb_2} with a {noun_2}. Either way, we imagine that 
     after witnessing him {present_tense_verb_2} with a {noun_2} there are probably a whole lot of people that are going to need some therapy!
    """
)



myStories = {"Story 1": story1, "Story 2": story2, "Story 3": story3, "Story 4": story4, "Story 5": story5}





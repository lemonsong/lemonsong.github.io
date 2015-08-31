from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
import re
text=open('01_27_2015.txt')
stopwords = stopwords.words('english')
english_punctuations = [',', '.', ':', ';','?','(',')','[',']','&','!','*','@','#','$', '%']
stopwords=stopwords+english_punctuations
word_freq=dict()
for line in text:
    url_pat = re.compile(r'http(s?)://[\w./]+')
    user_pat = re.compile(r'@\w+')
    name=re.compile(r'Jack Ma')
    name2=re.compile(r'Jack')
    line = url_pat.sub('', line)
    line = user_pat.sub('', line)
    line = name2.sub('Jack_Ma',line)
    line = name.sub('Jack_Ma',line)
    line = line.strip()
    line=re.split(r"[;:',.?\-\s#]\s*",line)
    line=[word.lower() for word in line] 
    line=[word for word in line if not word in stopwords]
    #line = [[word.lower() for word in word_tokenize(line)]]
    #print line
    max=len(line)
    for i in range(0,max):

        if i<max:
            if line[i] in stopwords:
                del line[i]
                i=i-1
                max=max-1

    for w in line:
        if w[0:4]<>'com/' and 1<len(w)<20 and w[0:2]<>'co/':   
            if w in word_freq: # the user has been seen before, add +1 to his count.
                word_freq[w]=word_freq[w]+1
            else: # first time we see this user, initialise his count to 1. 
                word_freq[w]=1
            
for w in word_freq:#for each user
    print w,word_freq[w] # print the user's name and his count.

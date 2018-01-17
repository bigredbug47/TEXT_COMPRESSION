#Run Length Coding
import os
def compress(input_string):
    count = 1
    prev = ''
    lst = []
    for character in input_string:
        if character != prev:
            if prev:
                entry = (prev,count)
                lst.append(entry)
                count = 1
            prev = character
        else:
            count += 1
    else:
        entry = (character,count)
        lst.append(entry)
    return lst
 
 
def decompress(lst):
    q = ""
    for character, count in lst:
        q += character * count
    return q
 
def save_to_file(path,thelist):
    with open(path,"wt") as thefile:
        for item in thelist:
            for el in item:
                if el == "\n":
                    thefile.write("\\n`")
                elif el=="`":
                    thefile.write("\"`")
                else:
                    thefile.write("%s`" % el)
        thefile.seek(-1, os.SEEK_END)
        thefile.truncate()
        thefile.close()
    return

def read_from_file(path):
    with open(path, "r") as ins:
        array = []
        t_array=[]
        check_n=0
        flag=0
        i=0
        for line in ins.read().split('`'):
            if i == 0:
                if line=="\\n":
                    t_array.append("\n")
                else:
                    t_array.append(str(line))
                i=i+1
            elif i == 1:
                t_array.append(int(line))
                i=i+1
            if i == 2:
                array.append((t_array[flag],t_array[flag+1]))
                flag=flag+2
                i=0
        ins.close()      
    return array

def runRLC(self):
    path = os.getcwd()+self
    result_file = open(path+"\\result\\resultRLC.txt","wt")
    for filename in os.listdir(path):
        if filename.endswith(".txt"):
            print("\\"+filename+": ")
            test_file = open(path+"\\"+filename,"r")
            write_file = path+"\compress\compressRLC_"+filename
            
            text = test_file.read()
            a=compress(text)
            save_to_file(write_file,a)
            c=read_from_file(write_file)
            b=decompress(c)
            
            save_file = path+"\decompress\decompressRLC_"+filename
            decompress_file = open(save_file,"wt")
            decompress_file.write(b)
            decompress_file.close()
            test_file.close()
            compress_size=os.path.getsize(write_file)
            decompress_size=os.path.getsize(save_file)
            
            print("Original: %d"%decompress_size)
            print("Compress: %d"%compress_size)
            result_file.write(str(filename)+"\t"+str(decompress_size)+"\t"+str(compress_size)+"\n")
            
    result_file.close()
    return 


self = "\dataset"
runRLC(self)
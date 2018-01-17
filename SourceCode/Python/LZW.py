#LZW Compression
import os

def compress(uncompressed):
    """Compress a string to a list of output symbols."""
 
    # Build the dictionary.
    dict_size = 256
    dictionary = dict((chr(i), i) for i in xrange(dict_size))
    # in Python 3: dictionary = {chr(i): i for i in range(dict_size)}
 
    w = ""
    result = []
    for c in uncompressed:
        wc = w + c
        if wc in dictionary:
            w = wc
        else:
            result.append(dictionary[w])
            # Add wc to the dictionary.
            dictionary[wc] = dict_size
            dict_size += 1
            w = c
 
    # Output the code for w.
    if w:
        result.append(dictionary[w])
    return result
 
 
def decompress(compressed):
    """Decompress a list of output ks to a string."""
    from cStringIO import StringIO
 
    # Build the dictionary.
    dict_size = 256
    dictionary = dict((i, chr(i)) for i in xrange(dict_size))
    # in Python 3: dictionary = {i: chr(i) for i in range(dict_size)}
 
    # use StringIO, otherwise this becomes O(N^2)
    # due to string concatenation in a loop
    result = StringIO()
    w = chr(compressed.pop(0))
    result.write(w)
    for k in compressed:
        if k in dictionary:
            entry = dictionary[k]
        elif k == dict_size:
            entry = w + w[0]
        else:
            raise ValueError('Bad compressed k: %s' % k)
        result.write(entry)
 
        # Add w+entry[0] to the dictionary.
        dictionary[dict_size] = w + entry[0]
        dict_size += 1
 
        w = entry
    return result.getvalue()
 
def save_to_file(path,thelist):
    with open(path,"wt") as thefile:
        for item in thelist:
            thefile.write("%d`" % item)
        thefile.seek(-1, os.SEEK_END)
        thefile.truncate()
    thefile.close()
    return

def read_from_file(path):
    with open(path, "r") as ins:
        array = []
        for line in ins.read().split('`'):
            array.append(int(line))
    ins.close()
    return array

def runLZW(self):
    path = os.getcwd()+self
    result_file = open(path+"\\result\\resultLZW.txt","wt")
    for filename in os.listdir(path):
        if filename.endswith(".txt"):
            print("\\"+filename+": ")
            test_file = open(path+"\\"+filename,"r")
            write_file = path+"\compress\compressLZW_"+filename
            
            text = test_file.read()
            a=compress(text)
            save_to_file(write_file,a)
            c=read_from_file(write_file)
            b=decompress(c)
            
            save_file = path+"\decompress\decompressLZW_"+filename
            decompress_file = open(save_file,"wt")
            decompress_file.write(b)
            decompress_file.close()
            test_file.close()
            
            compress_size=os.path.getsize(write_file)
            decompress_size=os.path.getsize(save_file)
            print(b)
            print("Original: %d"%decompress_size)
            print("Compress: %d"%compress_size)
            result_file.write(str(filename)+"\t"+str(decompress_size)+"\t"+str(compress_size)+"\n")
            
    result_file.close()                   
    return 

self = "\dataset"
runLZW(self)
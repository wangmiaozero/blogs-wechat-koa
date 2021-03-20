GCC=g++

INCLUDEDIR=  -I../lib/include64/

LIBDIR= -L../lib/lib64/ -l crypto 
		
CPPFLAGS = -g -W -Wall

SOURCES = $(wildcard *.cpp)
OBJS=$(patsubst %.cpp,%.o,$(SOURCES) )

all: clean test_crypt

clean:
	rm -f *.o 
	rm -f test_crypt

test_crypt : $(OBJS) 
	$(GCC) -o $@ $^ $(INCLUDEDIR) $(LIBDIR) 

%.o	: %.cpp
	$(GCC) $(CPPFLAGS) -c $< -o $@ $(INCLUDEDIR)


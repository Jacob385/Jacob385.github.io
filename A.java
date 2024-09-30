import java.nio.charset.*;
import java.util.*;
import java.io.*;
public class Main {
  public static void main(String[] args) throws Exception{

String fileName = "src/main/java/input.txt";
Scanner scan = new Scanner(new File(fileName));
String input = "";
while (scan.hasNextLine()) {
input += scan.nextLine();
if (scan.hasNextLine()) {
input += "\n";}}
    


System.out.println(input);

int x;
//convert input into a straight line of hexagony code
String code="";
char[] inputArray=input.toCharArray();  
for(x=0; x<inputArray.length;x++){//for each character in the input
//counts number of times a char is repetted in a row
int count=1;
for(int i=x+1;i<inputArray.length&& inputArray[x]==inputArray[i];i++){
count++;
}
char charToPrint = inputArray[x];
String tempString=charToPrint+"";
byte[] bytes = tempString.getBytes(StandardCharsets.UTF_8);

if(bytes.length>1){
for(byte a: bytes) {
int i= Byte.toUnsignedInt(a)+256;
code+=(char)i+";";
}  
}
else{
//key chars preform other comands.
//when printing we print (char)(x%256).
//to print key chars we just add 256
String KEYCHARS=" \t\n0123456789()+-*:%~,.?;!$_|/\\<>[]#{}\"\'=^&`@";
if (KEYCHARS.indexOf(inputArray[x])>=0){
charToPrint+=256;
}
//if char is one off from the last char and is > 256 we can save a byte by using '(' or ')'
if(x>0){
if(inputArray[x]==inputArray[x-1]+1){
charToPrint=')';
}
if(inputArray[x]==inputArray[x-1]-1){
charToPrint='(';
}
}

code+=charToPrint+";".repeat(count);
x+=count-1;
}
}
code+="@";
System.out.println(code);   
//for grid size >1 this is the number of usable tiles
//3x^{2}-x+5
int sidelength =1;//length of the side of the grid
int length=1;//length of whole grid
int space=1;//length of avaliable tiles after comand tiles
int gridSizeReserver=0;//A char is needed at >= this index or the grid will be too small 
        //size up grid till it fits  
        for(x=1;space <code.length(); x++){
           System.out.println("x:"+x+" sidelength:"+sidelength+" length:"+length+" space:"+space+" gridSizeReserver:"+gridSizeReserver);// used to debug grid size   
          gridSizeReserver=length;
          
          space=3*x*x-x+5;
            length=3*x*(x+1)+1;
            sidelength++;
          }
      
    System.out.println("x:"+x+" sidelength:"+sidelength+" length:"+length+" space:"+space+" gridSizeReserver:"+gridSizeReserver);// used to debug grid size

    //end size up
    
    //holds the grid
    char[]outString=new char[length];

    outString[gridSizeReserver]='G';
    System.out.print("/////////////");
    for(char c: outString){if(c==0x0000)c='E';System.out.print(c);}//todo remove
      System.out.println();

    
    //add zigzag commands to output
int index=1,i;
    for( i=sidelength;i<sidelength*2-2;i++){
  index+=i;
//System.out.println(  index-1+" "+  index+" "+i);
if(i%2==0){
  outString[index-1]='>';
  outString[index+i-1]='/';

}else{
  outString[index-1]='\\';
  outString[index+i-1]='<';

}
    }
    index+=i;
    int middleRowIndex=index-1;
    outString[index+i-1]='/';

System.out.println("I: "+i);
for(i++;i>sidelength;i--){
index+=i;
  if((sidelength+i)%2==0){
    outString[index-1]='/';
    outString[index+i-3]='<';

  }else{
    outString[index-1]='>';
    outString[index+i-3]='\\';
  }
  
}

     for(char c: outString){if(c==0x0000)c='E';System.out.print(c);}//todo remove
    System.out.println();
    
//insert string to grid
    for(index=0,i=0;index<sidelength;){//top row
      outString[index++]=code.charAt(i++);
    }
    index=middleRowIndex;
    //set middle row left (outlier)
    outString[index++]=code.charAt(i++);
    
    int direction=1;//1=right, -1=left
    
for(x=0;x<sidelength-1;x++){//zigzag up from middle
    for(int j=0;j<sidelength*2-3-x;j++){//iterate through the row
      if(i<code.length()&&index>sidelength)
      outString[index]=code.charAt(i++);
    //  else
     //   System.out.println("error");
 index+=direction;
  
   }
  if(direction==1){//jumps to next row
    index-=sidelength*2-x;
  }else{
    index-=sidelength*2-3-x;
  }
  direction*=-1;
}
   

    if(direction==1){//jumps back to outlier in row two
      index+=sidelength*2-x-2;
    }else{
      index+=sidelength*2-x+1;
    }
    direction*=-1;
    
    for(char c: outString){if(c==0x0000)c='E';System.out.print(c);}//todo remove
    System.out.println();
    
    if(code.length()>i)
      outString[index]= code.charAt(i++);//outlier in row two

    //jump to start of bottom half
    if(direction==1){
       index=middleRowIndex+sidelength*2-1;
    }else{
      index=middleRowIndex+sidelength*4-4;
    }
    if(code.length()>i)
      outString[index]=code.charAt(i++);//outlier in top of bottom half
    index+=direction;
     
    
    for(x=1;x<sidelength;x++){//zigzag down from middle
      for(int j=0;j<sidelength*2-3-x;j++){
        if(i<code.length()&&index<outString.length)
          outString[index]=code.charAt(i++);
       //   else
         //   System.out.println("error");
         index+=direction;

      }
      if(direction==1){//jumps to next row
        index+=sidelength*2-3-x;
      }else{
        index+=sidelength*2-x;
      }
      direction*=-1;
    }
    if(i<code.length()){
    outString[length-1]=code.charAt(i++);
    }

    
    System.out.println("input length:"+input.length());
    System.out.println("code string length:"+code.length());
    System.out.println("grid length:"+length);
    System.out.println("side length:"+sidelength);
    System.out.println("space:"+space);


    //write output to output.txt
    try {
      FileWriter myWriter = new FileWriter("src/main/java/output.txt");
   
      for(char c: outString){
        if(c==0x0000)c='E';
        myWriter.write(c);
      }
      myWriter.close();
   
    } catch (IOException e) {
      System.out.println("An error occurred.");
      e.printStackTrace();
    }

  
  }
}
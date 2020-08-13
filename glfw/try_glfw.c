// https://www.glfw.org/documentation.html
// cc -o myprog myprog.c -lglfw -framework Cocoa -framework OpenGL -framework IOKit

#include <GLFW/glfw3.h>

int main(void) {
  GLFWwindow* window;


  // initialize library

  if(!glfwInit()) {
    return -1;
  }

  window = glfwCreateWindow(640, 480, "Helo GLFW", NULL, NULL);
  if (!window) {
    glfwTerminate();
    return -1;
  }

  // Before you can use the OpenGL API, you must have a current OpenGL context
  glfwMakeContextCurrent(window);

  // Loop 直到用户关闭窗口
  while (!glfwWindowShouldClose(window)) {
    glClear(GL_COLOR_BUFFER_BIT);

    glfwSwapBuffers(window);

    glfwPollEvents();
  }
  glfwTerminate();
  return 0;
}

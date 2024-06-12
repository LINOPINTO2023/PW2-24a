from colors import *
class Picture:
  def __init__(self, img):
    self.img = img

  def __eq__(self, other):
    return self.img == other.img

  def _invColor(self, color):
    if color not in inverter:
      return color
    return inverter[color]

  def verticalMirror(self):
    """ Devuelve el espejo vertical de la imagen """
    vertical = []
    for value in self.img:
      vertical.append(value[::-1])
    return Picture(vertical)

  def horizontalMirror(self):
    """ Devuelve el espejo horizontal de la imagen """
    horizontal = []
    for value in self.img[::-1]:
      horizontal.append(value)
    return Picture(horizontal)

  def negative(self):
    """ Devuelve un negativo de la imagen """
    newPic = []
    str = ""
    for s in self.img:
      str = ""
      for c in s:
        str = str + self._invColor(c)
      newPic.append(str)
    return Picture(newPic)

  def join(self, p):
    """ Devuelve una nueva figura poniendo la figura del argumento 
        al lado derecho de la figura actual """
    joined = []
    for c in range(0, len(self.img)):
      joined.append(self.img[c] + p.img[c])
    return Picture(joined)

  def up(self, p):
    newp = self.img + p.img
    return Picture(newp)

  def under(self, p):
    """ Devuelve una nueva figura poniendo la figura p sobre la
        figura actual """
    newp = p.img + self.img
    return Picture(newp)
  
  def horizontalRepeat(self, n):
    """ Devuelve una nueva figura repitiendo la figura actual al costado
        la cantidad de veces que indique el valor de n """
    p = []
    for c in range(0, len(self.img)):
      p.append("")
    pic = Picture(p)
    for i in range(0, n):
      pic = pic.join(self)
    return pic

  def verticalRepeat(self, n):
    if n is 0:
      return Picture(None)
    pic = Picture(self.img)
    for i in range(0, n-1):
      pic = pic.under(self)
    return Picture(pic)

  #Extra: Sólo para realmente viciosos 
  def rotateClock(self):
    """Devuelve una figura rotada en 90 grados, puede ser en sentido horario
    o antihorario"""
    """Para realizar esto nos fijamos que todas las columnas pasaran a ser ser filas
      Por lo que hacemos un for en el que agarramos todos los primeros characteres y los colocamos en string nesimo
      por seguridad tendre que realizar hasta el tamaño del primer string, luego vere para que agarre el mayor y rellene
      con blanco cuando se encuentre con errores de indexacion"""
    rotated = []
    s_ = ""
    for i in range(0, self._getWidth()):
      for j in range(self._getHeight()):
        try:
          s_ += self.img[self._getHeight()- (j - 1)][i]
        except:
          s_ += " "
      rotated.append(s_)
      s_= ""
    return Picture(rotated)
  def rotateAntiClock(self):
    """Devuelve una figura rotada en 90 grados, puede ser en sentido horario
    o antihorario"""
    return self.rotateClock().rotateClock().rotateClock()

  def _getHeight(self):
    return len(self.img)
  def _getWidth(self):
    max = 0
    for i in self.img:
      if len(i) > max:
        max = len(i)
    return max
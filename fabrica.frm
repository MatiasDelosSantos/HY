VERSION 5.00
Begin VB.Form frmarticulos 
   BackColor       =   &H00C0FFC0&
   Caption         =   "Articulos"
   ClientHeight    =   11040
   ClientLeft      =   60
   ClientTop       =   450
   ClientWidth     =   11010
   LinkTopic       =   "Form2"
   ScaleHeight     =   11040
   ScaleWidth      =   11010
   StartUpPosition =   2  'CenterScreen
   Begin VB.CommandButton cmdcalcul 
      BackColor       =   &H00C0FFC0&
      Caption         =   "Calculo"
      BeginProperty Font 
         Name            =   "Comic Sans MS"
         Size            =   14.25
         Charset         =   0
         Weight          =   700
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   615
      Left            =   7080
      Style           =   1  'Graphical
      TabIndex        =   8
      Top             =   8640
      Width           =   1680
   End
   Begin VB.TextBox txtmayorista 
      Alignment       =   1  'Right Justify
      BeginProperty DataFormat 
         Type            =   0
         Format          =   "0%"
         HaveTrueFalseNull=   0
         FirstDayOfWeek  =   0
         FirstWeekOfYear =   0
         LCID            =   11274
         SubFormatType   =   0
      EndProperty
      BeginProperty Font 
         Name            =   "Comic Sans MS"
         Size            =   14.25
         Charset         =   0
         Weight          =   700
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   615
      Left            =   5640
      TabIndex        =   5
      Top             =   8640
      Width           =   855
   End
   Begin VB.TextBox txtgremio 
      Alignment       =   1  'Right Justify
      BeginProperty Font 
         Name            =   "Comic Sans MS"
         Size            =   14.25
         Charset         =   0
         Weight          =   700
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   615
      Left            =   3000
      TabIndex        =   6
      Top             =   8640
      Width           =   855
   End
   Begin VB.TextBox txtPublico 
      Alignment       =   1  'Right Justify
      BeginProperty Font 
         Name            =   "Comic Sans MS"
         Size            =   14.25
         Charset         =   0
         Weight          =   700
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   615
      Left            =   240
      TabIndex        =   7
      Top             =   8640
      Width           =   855
   End
   Begin VB.CommandButton cmdlista4 
      BackColor       =   &H00C0FFC0&
      Caption         =   "Precio lista 4"
      BeginProperty Font 
         Name            =   "Comic Sans MS"
         Size            =   14.25
         Charset         =   0
         Weight          =   700
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   1215
      Left            =   8280
      Style           =   1  'Graphical
      TabIndex        =   34
      Top             =   7080
      Width           =   2400
   End
   Begin VB.CommandButton cmdlista3 
      BackColor       =   &H00C0FFC0&
      Caption         =   "Precio lista3"
      BeginProperty Font 
         Name            =   "Comic Sans MS"
         Size            =   14.25
         Charset         =   0
         Weight          =   700
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   1215
      Left            =   5520
      Style           =   1  'Graphical
      TabIndex        =   33
      Top             =   7080
      Width           =   2400
   End
   Begin VB.CommandButton cmdlista2 
      BackColor       =   &H00C0FFC0&
      Caption         =   "Gremio"
      BeginProperty Font 
         Name            =   "Comic Sans MS"
         Size            =   14.25
         Charset         =   0
         Weight          =   700
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   1215
      Left            =   2760
      MaskColor       =   &H00FFFF80&
      Style           =   1  'Graphical
      TabIndex        =   32
      Top             =   7080
      Width           =   2400
   End
   Begin VB.ComboBox Cbomarca 
      BeginProperty Font 
         Name            =   "Comic Sans MS"
         Size            =   14.25
         Charset         =   0
         Weight          =   700
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   525
      ItemData        =   "fabrica.frx":0000
      Left            =   120
      List            =   "fabrica.frx":0002
      TabIndex        =   1
      Top             =   4080
      Width           =   3270
   End
   Begin VB.TextBox txtcodfab 
      BeginProperty Font 
         Name            =   "Comic Sans MS"
         Size            =   14.25
         Charset         =   0
         Weight          =   700
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   615
      Left            =   4200
      MaxLength       =   50
      TabIndex        =   2
      Top             =   4080
      Width           =   2895
   End
   Begin VB.CommandButton cmddesplazar 
      BackColor       =   &H0080FF80&
      Height          =   735
      Index           =   3
      Left            =   3480
      Picture         =   "fabrica.frx":0004
      Style           =   1  'Graphical
      TabIndex        =   22
      Top             =   9720
      Width           =   975
   End
   Begin VB.CommandButton cmddesplazar 
      BackColor       =   &H0080FF80&
      Height          =   735
      Index           =   2
      Left            =   2400
      Picture         =   "fabrica.frx":2986
      Style           =   1  'Graphical
      TabIndex        =   21
      Top             =   9720
      Width           =   975
   End
   Begin VB.CommandButton cmddesplazar 
      BackColor       =   &H0080FF80&
      Height          =   735
      Index           =   1
      Left            =   1320
      Picture         =   "fabrica.frx":5308
      Style           =   1  'Graphical
      TabIndex        =   20
      Top             =   9720
      Width           =   975
   End
   Begin VB.CommandButton cmddesplazar 
      BackColor       =   &H0080FF80&
      Height          =   735
      Index           =   0
      Left            =   240
      Picture         =   "fabrica.frx":7C8A
      Style           =   1  'Graphical
      TabIndex        =   19
      Top             =   9720
      Width           =   975
   End
   Begin VB.CommandButton cmdsalir 
      BackColor       =   &H000000FF&
      Caption         =   "Salir"
      BeginProperty Font 
         Name            =   "Comic Sans MS"
         Size            =   11.25
         Charset         =   0
         Weight          =   700
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   975
      Left            =   8880
      Picture         =   "fabrica.frx":A60C
      Style           =   1  'Graphical
      TabIndex        =   18
      Top             =   9600
      Width           =   1815
   End
   Begin VB.CommandButton cmdbuscar 
      BackColor       =   &H0080FF80&
      Caption         =   "Buscar"
      BeginProperty Font 
         Name            =   "Comic Sans MS"
         Size            =   11.25
         Charset         =   0
         Weight          =   700
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   855
      Left            =   8880
      Picture         =   "fabrica.frx":CF8E
      Style           =   1  'Graphical
      TabIndex        =   17
      Top             =   5880
      Width           =   1815
   End
   Begin VB.CommandButton cmdcancelar 
      BackColor       =   &H0080FF80&
      Caption         =   "Cancelar"
      BeginProperty Font 
         Name            =   "Comic Sans MS"
         Size            =   11.25
         Charset         =   0
         Weight          =   700
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   855
      Left            =   8880
      Picture         =   "fabrica.frx":D298
      Style           =   1  'Graphical
      TabIndex        =   16
      Top             =   4800
      Width           =   1815
   End
   Begin VB.CommandButton cmdaceptar 
      BackColor       =   &H0080FF80&
      Caption         =   "Aceptar"
      BeginProperty Font 
         Name            =   "Comic Sans MS"
         Size            =   11.25
         Charset         =   0
         Weight          =   700
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   855
      Left            =   8880
      Picture         =   "fabrica.frx":D5A2
      Style           =   1  'Graphical
      TabIndex        =   9
      Top             =   3720
      Width           =   1815
   End
   Begin VB.CommandButton cmdeliminar 
      BackColor       =   &H0080FF80&
      Caption         =   "Eliminar"
      BeginProperty Font 
         Name            =   "Comic Sans MS"
         Size            =   11.25
         Charset         =   0
         Weight          =   700
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   855
      Left            =   8880
      Picture         =   "fabrica.frx":D8AC
      Style           =   1  'Graphical
      TabIndex        =   15
      Top             =   2640
      Width           =   1815
   End
   Begin VB.CommandButton cmdmodificar 
      BackColor       =   &H0080FF80&
      Caption         =   "Modificar"
      BeginProperty Font 
         Name            =   "Comic Sans MS"
         Size            =   11.25
         Charset         =   0
         Weight          =   700
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   855
      Left            =   8880
      Picture         =   "fabrica.frx":DBB6
      Style           =   1  'Graphical
      TabIndex        =   14
      Top             =   1560
      Width           =   1815
   End
   Begin VB.CommandButton cmdagregar 
      BackColor       =   &H0080FF80&
      Caption         =   "Agregar"
      BeginProperty Font 
         Name            =   "Comic Sans MS"
         Size            =   11.25
         Charset         =   0
         Weight          =   700
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   855
      Left            =   8880
      Picture         =   "fabrica.frx":DEC0
      Style           =   1  'Graphical
      TabIndex        =   13
      Top             =   480
      Width           =   1815
   End
   Begin VB.TextBox txtl4 
      Alignment       =   1  'Right Justify
      BeginProperty Font 
         Name            =   "Comic Sans MS"
         Size            =   14.25
         Charset         =   0
         Weight          =   700
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   615
      Left            =   8400
      TabIndex        =   4
      Top             =   7680
      Width           =   1935
   End
   Begin VB.TextBox txtl3 
      Alignment       =   1  'Right Justify
      BeginProperty Font 
         Name            =   "Comic Sans MS"
         Size            =   14.25
         Charset         =   0
         Weight          =   700
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   615
      Left            =   5640
      TabIndex        =   12
      Top             =   7680
      Width           =   1935
   End
   Begin VB.TextBox Txtl2 
      Alignment       =   1  'Right Justify
      BeginProperty Font 
         Name            =   "Comic Sans MS"
         Size            =   14.25
         Charset         =   0
         Weight          =   700
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   615
      Left            =   3000
      TabIndex        =   11
      Top             =   7680
      Width           =   1935
   End
   Begin VB.TextBox txtl1 
      Alignment       =   1  'Right Justify
      BeginProperty Font 
         Name            =   "Comic Sans MS"
         Size            =   14.25
         Charset         =   0
         Weight          =   700
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   615
      Left            =   240
      TabIndex        =   10
      Top             =   7680
      Width           =   1935
   End
   Begin VB.TextBox txtdesc 
      BeginProperty Font 
         Name            =   "Comic Sans MS"
         Size            =   14.25
         Charset         =   0
         Weight          =   700
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   615
      Left            =   120
      MaxLength       =   150
      TabIndex        =   3
      Top             =   5640
      Width           =   6975
   End
   Begin VB.TextBox txtcodigo 
      BeginProperty Font 
         Name            =   "Comic Sans MS"
         Size            =   14.25
         Charset         =   0
         Weight          =   700
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   615
      Left            =   120
      Locked          =   -1  'True
      TabIndex        =   0
      Top             =   2520
      Width           =   2895
   End
   Begin VB.Label Label1 
      AutoSize        =   -1  'True
      BackColor       =   &H00C0FFC0&
      Caption         =   "ARTICULOS"
      BeginProperty Font 
         Name            =   "Comic Sans MS"
         Size            =   48
         Charset         =   0
         Weight          =   700
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   1350
      Left            =   2160
      TabIndex        =   31
      Top             =   0
      Width           =   5775
   End
   Begin VB.Label lblleyenda 
      AutoSize        =   -1  'True
      BackColor       =   &H00C0FFC0&
      Caption         =   "CODIGO DE FABRICA"
      BeginProperty Font 
         Name            =   "Comic Sans MS"
         Size            =   18
         Charset         =   0
         Weight          =   700
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   525
      Index           =   7
      Left            =   3720
      TabIndex        =   30
      Top             =   3360
      Width           =   3900
   End
   Begin VB.Label lbllista4 
      AutoSize        =   -1  'True
      BackColor       =   &H00C0FFC0&
      Caption         =   "Precio lista 4"
      BeginProperty Font 
         Name            =   "Comic Sans MS"
         Size            =   18
         Charset         =   0
         Weight          =   700
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   525
      Index           =   6
      Left            =   8280
      TabIndex        =   29
      Top             =   6960
      Width           =   2325
   End
   Begin VB.Label lbllista3 
      AutoSize        =   -1  'True
      BackColor       =   &H00C0FFC0&
      Caption         =   "Precio lista 3"
      BeginProperty Font 
         Name            =   "Comic Sans MS"
         Size            =   18
         Charset         =   0
         Weight          =   700
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   525
      Index           =   5
      Left            =   5520
      TabIndex        =   28
      Top             =   6960
      Width           =   2325
   End
   Begin VB.Label lbllista2 
      AutoSize        =   -1  'True
      BackColor       =   &H00C0FFC0&
      Caption         =   "Gremio"
      BeginProperty Font 
         Name            =   "Comic Sans MS"
         Size            =   18
         Charset         =   0
         Weight          =   700
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   525
      Index           =   4
      Left            =   3360
      TabIndex        =   27
      Top             =   6960
      Width           =   1200
   End
   Begin VB.Label lblleyenda 
      AutoSize        =   -1  'True
      BackColor       =   &H00C0FFC0&
      Caption         =   "Publico"
      BeginProperty Font 
         Name            =   "Comic Sans MS"
         Size            =   18
         Charset         =   0
         Weight          =   700
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   525
      Index           =   3
      Left            =   600
      TabIndex        =   26
      Top             =   6960
      Width           =   1170
   End
   Begin VB.Label lblleyenda 
      AutoSize        =   -1  'True
      BackColor       =   &H00C0FFC0&
      Caption         =   "DESCRIPCION"
      BeginProperty Font 
         Name            =   "Comic Sans MS"
         Size            =   18
         Charset         =   0
         Weight          =   700
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   525
      Index           =   2
      Left            =   120
      TabIndex        =   25
      Top             =   4920
      Width           =   2580
   End
   Begin VB.Label lblleyenda 
      AutoSize        =   -1  'True
      BackColor       =   &H00C0FFC0&
      Caption         =   "MARCA"
      BeginProperty Font 
         Name            =   "Comic Sans MS"
         Size            =   18
         Charset         =   0
         Weight          =   700
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   525
      Index           =   1
      Left            =   120
      TabIndex        =   24
      Top             =   3360
      Width           =   1305
   End
   Begin VB.Label lblleyenda 
      AutoSize        =   -1  'True
      BackColor       =   &H00C0FFC0&
      Caption         =   "CODIGO LOCAL"
      BeginProperty Font 
         Name            =   "Comic Sans MS"
         Size            =   18
         Charset         =   0
         Weight          =   700
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   525
      Index           =   0
      Left            =   120
      TabIndex        =   23
      Top             =   1800
      Width           =   2805
   End
End
Attribute VB_Name = "frmarticulos"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Private Sub cmdaceptar_Click()
If flag = 1 Then
    rArt.AddNew
    rContador.Edit
    rContador!codart = rContador!codart + 1
    rContador.Update
ElseIf flag = 2 Then
    rArt.Edit
End If
reemplazar
rArt.Update
If flag = 1 Then
    If rArt.RecordCount > 0 Then
        rArt.MoveLast
        cargar
    Else
        iniciar
    End If
End If
Accion
cambiar True

End Sub



Private Sub cmdagregar_Click()
cambiar False

flag = 1
iniciar
txtcodigo.Text = strzero(rContador!codart, 5)
Cbomarca.SetFocus
Txtl2.Visible = True
txtl3.Visible = True
txtl4.Visible = True
cmdlista2.Visible = False
cmdlista3.Visible = False
cmdlista4.Visible = False



End Sub

Private Sub cmdBuscar_Click()
frmbuscar2.Show

End Sub


Private Sub cmdcalcul_Click()
If txtmayorista.Text <> 0 Then
    txtl3.Text = txtl4.Text + (txtl4.Text * (txtmayorista / 100))
End If
If txtgremio.Text <> 0 Then
    Txtl2.Text = txtl4.Text + (txtl4.Text * (txtgremio.Text / 100))
End If
If txtPublico.Text <> 0 Then
    txtl1.Text = txtl4.Text + (txtl4.Text * (txtPublico.Text / 100))
End If
End Sub

Private Sub cmdcancelar_Click()
cambiar True
Accion
End Sub

Private Sub cmddesplazar_Click(Index As Integer)
Select Case Index
        Case 0: rArt.MoveFirst
        Case 1: rArt.MovePrevious
            If rArt.BOF Then rArt.MoveFirst
        Case 2: rArt.MoveNext
            If rArt.EOF Then rArt.MoveLast
        Case 3: rArt.MoveLast
End Select
cargar
End Sub

Private Sub cmdeliminar_Click()
Dim confirma As String
confirma = MsgBox("confirma la eliminacion del registro", vbYesNo, "confirmacion")
        If confirma = vbYes Then
            rArt.Delete
            rArt.MoveNext
            If rArt.EOF Then rArt.MoveLast
            cargar
            MsgBox "Registro eliminado.....", vbExclamation, "Mensaje"
        Else
            MsgBox "eliminacion cancelada por el usuario", vbExclamation, "Mensaje"
        End If
End Sub

Private Sub cambiar(cambio As Boolean)
cmdagregar.Enabled = cambio
cmdmodificar.Enabled = cambio
cmdeliminar.Enabled = cambio
cmdbuscar.Enabled = cambio
cmdsalir.Enabled = cambio

cmddesplazar(0).Enabled = cambio
cmddesplazar(1).Enabled = cambio
cmddesplazar(2).Enabled = cambio
cmddesplazar(3).Enabled = cambio

cmdaceptar.Enabled = Not cambio
cmdcancelar.Enabled = Not cambio
txtcodigo.Enabled = Not cambio
Cbomarca.Enabled = Not cambio
txtdesc.Enabled = Not cambio
txtcodfab.Enabled = Not cambio
txtl1.Enabled = Not cambio
Txtl2.Enabled = Not cambio
txtl3.Enabled = Not cambio
txtl4.Enabled = Not cambio
txtPublico.Visible = Not cambio
txtgremio.Visible = Not cambio
txtmayorista.Visible = Not cambio
cmdcalcul.Visible = Not cambio




End Sub


Private Sub iniciar()
cargarcombo
txtcodigo.Text = ""
Cbomarca.Text = ""
txtdesc.Text = ""
txtl1.Text = 0
Txtl2.Text = 0
txtl3.Text = 0
txtl4.Text = 0

txtcodfab.Text = ""
txtPublico.Text = ""
txtgremio.Text = ""
txtmayorista.Text = ""
txtmayorista.Text = 0
txtgremio.Text = 0
txtPublico.Text = 0

End Sub
Private Sub reemplazar()
rArt!codigo = txtcodigo.Text
rArt!marca = Cbomarca.Text
rArt!descripcion = txtdesc.Text
rArt!preciol1 = txtl1.Text
rArt!preciol2 = Txtl2.Text
rArt!preciol3 = txtl3.Text
rArt!preciol4 = txtl4.Text
rArt!codfab = txtcodfab.Text
rArt!Publico = txtPublico.Text
rArt!gremio = txtgremio.Text
rArt!mayorista = txtmayorista.Text



End Sub
Private Sub cargar()
txtcodigo.Text = IIf(IsNull(rArt!codigo), "", rArt!codigo)
Cbomarca.Text = IIf(IsNull(rArt!marca), "", rArt!marca)
txtdesc.Text = IIf(IsNull(rArt!descripcion), "", rArt!descripcion)
txtl1.Text = IIf(IsNull(rArt!preciol1), "", rArt!preciol1)
Txtl2.Text = IIf(IsNull(rArt!preciol2), "", rArt!preciol2)
txtl3.Text = IIf(IsNull(rArt!preciol3), "", rArt!preciol3)
txtl4.Text = IIf(IsNull(rArt!preciol4), "", rArt!preciol4)
txtcodfab.Text = IIf(IsNull(rArt!codfab), "", rArt!codfab)
txtPublico.Text = IIf(IsNull(rArt!Publico), "", rArt!Publico)
txtgremio.Text = IIf(IsNull(rArt!gremio), "", rArt!gremio)
txtmayorista.Text = IIf(IsNull(rArt!mayorista), "", rArt!mayorista)


End Sub

Private Sub cmdlista2_Click()
Txtl2.Visible = True
cmdlista2.Visible = False
End Sub

Private Sub cmdlista3_Click()
frmcontra.Show


End Sub

Private Sub cmdlista4_Click()
frmcontra1.Show
End Sub

Private Sub cmdmodificar_Click()
cambiar False
flag = 2
Cbomarca.SetFocus

End Sub


Private Sub cmdsalir_Click()
frmcontra.Visible = False
frmcontra1.Visible = False
Unload Me
End Sub



Private Sub Form_Load()
Set rArt = miBase.OpenRecordset("Articulos", dbOpenDynaset)
cambiar True
If Not rArt.EOF Then
    rArt.MoveFirst
    cargar
End If
Txtl2.Visible = False
txtl3.Visible = False
txtl4.Visible = False

End Sub
Private Sub cargarcombo()
Set miRecor = miBase.OpenRecordset("select marca from articulos group by marca", dbOpenDynaset)
If miRecor.RecordCount > 0 Then
    miRecor.MoveFirst
    Cbomarca.Clear
    Do While Not miRecor.EOF
        If Not IsNull(miRecor!marca) Then
            Cbomarca.AddItem miRecor!marca
           
        End If
        miRecor.MoveNext
    Loop
    If Cbomarca.ListCount > 0 Then
        Cbomarca.ListIndex = 0
        
    End If
End If
    miRecor.Close
    


End Sub



Private Sub txtcodigo_KeyDown(KeyCode As Integer, Shift As Integer)
If KeyCode = 13 Then SendKeys "{TAB}", True
End Sub


Private Sub Accion()
Txtl2.Visible = False
txtl3.Visible = False
txtl4.Visible = False
cmdlista2.Visible = True
cmdlista3.Visible = True
cmdlista4.Visible = True
End Sub

Private Sub txtdesc_KeyDown(KeyCode As Integer, Shift As Integer)
If KeyCode = 13 Then SendKeys "{TAB}", True
End Sub




Private Sub txtcodfab_KeyDown(KeyCode As Integer, Shift As Integer)
If KeyCode = 13 Then SendKeys "{TAB}", True
End Sub

Private Sub txtl1_Change()
If txtl1.Text <> " " Then
    If Not IsNumeric(txtl1.Text) Then
        MsgBox "dato no valido, debe ingresar solo numeros..", vbCritical, "mensaje"
        txtl1.Text = 0
        SendKeys "+{tab}", True
    End If
End If
End Sub

Private Sub txtl1_GotFocus()
txtl1.SelStart = 0
txtl1.SelLength = Len(txtl1.Text)
End Sub

Private Sub txtl1_KeyDown(KeyCode As Integer, Shift As Integer)
If KeyCode = 13 Then SendKeys "{TAB}", True
End Sub



Private Sub txtl1_KeyPress(KeyAscii As Integer)
If Asc(".") = KeyAscii Then
            KeyAscii = Asc(",")
    End If
End Sub

Private Sub Txtl2_Change()
If Txtl2.Text <> " " Then
    If Not IsNumeric(Txtl2.Text) Then
        MsgBox "dato no valido, debe ingresar solo numeros..", vbCritical, "mensaje"
        Txtl2.Text = 0
        SendKeys "+{tab}", True
    End If
End If
End Sub

Private Sub Txtl2_GotFocus()
Txtl2.SelStart = 0
Txtl2.SelLength = Len(Txtl2.Text)
End Sub

Private Sub Txtl2_KeyDown(KeyCode As Integer, Shift As Integer)
If KeyCode = 13 Then SendKeys "{TAB}", True
End Sub



Private Sub Txtl2_KeyPress(KeyAscii As Integer)
If Asc(".") = KeyAscii Then
            KeyAscii = Asc(",")
    End If
End Sub

Private Sub txtl3_GotFocus()
txtl3.SelStart = 0
txtl3.SelLength = Len(txtl3.Text)
End Sub

Private Sub txtl3_KeyDown(KeyCode As Integer, Shift As Integer)
If KeyCode = 13 Then SendKeys "{TAB}", True
End Sub



Private Sub txtl3_KeyPress(KeyAscii As Integer)
If Asc(".") = KeyAscii Then
            KeyAscii = Asc(",")
    End If
End Sub

Private Sub txtl4_Change()
If txtl4.Text <> " " Then
    If Not IsNumeric(txtl4.Text) Then
        MsgBox "dato no valido, debe ingresar solo numeros..", vbCritical, "mensaje"
        txtl4.Text = 0
        SendKeys "+{tab}", True
    End If
End If
End Sub

Private Sub txtl4_GotFocus()
txtl4.SelStart = 0
txtl4.SelLength = Len(txtl4.Text)
End Sub

Private Sub txtl4_KeyDown(KeyCode As Integer, Shift As Integer)
If KeyCode = 13 Then SendKeys "{TAB}", True
End Sub

Private Sub cbomarca_KeyDown(KeyCode As Integer, Shift As Integer)
If KeyCode = 13 Then SendKeys "{TAB}", True
End Sub

Private Sub txtl4_KeyPress(KeyAscii As Integer)

If Asc(".") = KeyAscii Then
            KeyAscii = Asc(",")
    End If
End Sub


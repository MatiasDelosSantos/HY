VERSION 5.00
Begin VB.Form cerrajeria 
   BackColor       =   &H00FFFFFF&
   Caption         =   "HERRAJES  H. YRIGOYEN 825 S.A."
   ClientHeight    =   10320
   ClientLeft      =   60
   ClientTop       =   450
   ClientWidth     =   14715
   LinkTopic       =   "Form1"
   Picture         =   "cerrajeria.frx":0000
   ScaleHeight     =   10320
   ScaleWidth      =   14715
   StartUpPosition =   2  'CenterScreen
   WindowState     =   2  'Maximized
   Begin VB.CommandButton cmdcuentas 
      BackColor       =   &H0080FF80&
      Caption         =   "Cuentas"
      BeginProperty Font 
         Name            =   "Comic Sans MS"
         Size            =   20.25
         Charset         =   0
         Weight          =   700
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   1215
      Left            =   3840
      Picture         =   "cerrajeria.frx":12351
      Style           =   1  'Graphical
      TabIndex        =   9
      Top             =   7320
      Width           =   3255
   End
   Begin VB.CommandButton cmdcobrar 
      BackColor       =   &H0080FF80&
      Caption         =   "Cobranzas"
      BeginProperty Font 
         Name            =   "Comic Sans MS"
         Size            =   20.25
         Charset         =   0
         Weight          =   700
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   1215
      Left            =   3840
      Picture         =   "cerrajeria.frx":14CD3
      Style           =   1  'Graphical
      TabIndex        =   8
      Top             =   8880
      Width           =   3255
   End
   Begin VB.CommandButton cmdactualizar 
      BackColor       =   &H0080FF80&
      Caption         =   "Actualizar"
      BeginProperty Font 
         Name            =   "Comic Sans MS"
         Size            =   20.25
         Charset         =   0
         Weight          =   700
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   1215
      Left            =   240
      Picture         =   "cerrajeria.frx":17655
      Style           =   1  'Graphical
      TabIndex        =   5
      Top             =   8880
      Width           =   3255
   End
   Begin VB.CommandButton cmdlistado 
      BackColor       =   &H0080FF80&
      Caption         =   "Listados"
      BeginProperty Font 
         Name            =   "Comic Sans MS"
         Size            =   20.25
         Charset         =   0
         Weight          =   700
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   1215
      Left            =   240
      Picture         =   "cerrajeria.frx":19FD7
      Style           =   1  'Graphical
      TabIndex        =   4
      Top             =   7320
      Width           =   3255
   End
   Begin VB.CommandButton Command1 
      BackColor       =   &H0080FF80&
      Caption         =   " Presupuesto"
      BeginProperty Font 
         Name            =   "Comic Sans MS"
         Size            =   20.25
         Charset         =   0
         Weight          =   700
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   1215
      Left            =   240
      Picture         =   "cerrajeria.frx":1C959
      Style           =   1  'Graphical
      TabIndex        =   3
      Top             =   5760
      Width           =   3255
   End
   Begin VB.CommandButton cmdclientes 
      BackColor       =   &H0080FF80&
      Caption         =   "Clientes"
      BeginProperty Font 
         Name            =   "Comic Sans MS"
         Size            =   24
         Charset         =   0
         Weight          =   700
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   1215
      Left            =   240
      Picture         =   "cerrajeria.frx":1E41B
      Style           =   1  'Graphical
      TabIndex        =   2
      Top             =   4200
      Width           =   3255
   End
   Begin VB.CommandButton cmdsalir 
      BackColor       =   &H000000FF&
      Caption         =   "SALIR"
      BeginProperty Font 
         Name            =   "Comic Sans MS"
         Size            =   18
         Charset         =   0
         Weight          =   700
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   1215
      Left            =   10320
      Picture         =   "cerrajeria.frx":1E9B1
      Style           =   1  'Graphical
      TabIndex        =   1
      Top             =   8880
      Width           =   1815
   End
   Begin VB.CommandButton cmdproductos 
      BackColor       =   &H0080FF80&
      Caption         =   "Articulos"
      BeginProperty Font 
         Name            =   "Comic Sans MS"
         Size            =   24
         Charset         =   0
         Weight          =   700
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   1215
      Left            =   240
      Picture         =   "cerrajeria.frx":21333
      Style           =   1  'Graphical
      TabIndex        =   0
      Top             =   2640
      Width           =   3255
   End
   Begin VB.Label Label2 
      AutoSize        =   -1  'True
      BackStyle       =   0  'Transparent
      Caption         =   "Cerrajeria"
      BeginProperty Font 
         Name            =   "Century Schoolbook"
         Size            =   36
         Charset         =   0
         Weight          =   400
         Underline       =   0   'False
         Italic          =   -1  'True
         Strikethrough   =   0   'False
      EndProperty
      ForeColor       =   &H00008080&
      Height          =   855
      Left            =   3960
      TabIndex        =   7
      Top             =   1680
      Width           =   3405
   End
   Begin VB.Label Label1 
      AutoSize        =   -1  'True
      BackColor       =   &H80000009&
      BackStyle       =   0  'Transparent
      Caption         =   "H. Yrigoyen 825 S.A."
      BeginProperty Font 
         Name            =   "Century Schoolbook"
         Size            =   48
         Charset         =   0
         Weight          =   400
         Underline       =   0   'False
         Italic          =   -1  'True
         Strikethrough   =   0   'False
      EndProperty
      ForeColor       =   &H00008080&
      Height          =   1155
      Left            =   1080
      TabIndex        =   6
      Top             =   240
      Width           =   9225
   End
End
Attribute VB_Name = "cerrajeria"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Private Sub cmdactualizar_Click()
frmactualizar.Show
End Sub

Private Sub cmdcobrar_Click()
frmcobranza.Show
End Sub

Private Sub cmdcuentas_Click()
frmcuentas.Show
End Sub

Private Sub cmdlistado_Click()
frmlistado.Show

End Sub

Private Sub Command1_Click()

frmremito.Show

End Sub

Private Sub cmdclientes_Click()
frmclientes.Show
End Sub

Private Sub cmdproductos_Click()
frmarticulos.Show
End Sub

Private Sub cmdsalir_Click()
End
End Sub

Private Sub Command2_Click()

End Sub

Private Sub Form_Load()
Set miBase = OpenDatabase(App.Path & "\HY.mdb", False, False)
Set rContador = miBase.OpenRecordset("contador", dbOpenDynaset)
End Sub
